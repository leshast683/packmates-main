/**
 * /api/send-newsletter — fired weekly by Vercel Cron (see vercel.json's
 * `crons` entry). Sends the oldest `queued` row from the `newsletters`
 * table — authored by hand in Supabase Studio's Table Editor, no deploy
 * needed — to every user who has opted in via Settings' "Weekly Newsletter"
 * toggle (profiles.notif->>'updates' = true), then marks that row 'sent'.
 * If nothing is queued, this is a no-op for the week.
 * Guard: only Vercel Cron (or a manual call carrying the same secret) may
 * trigger this — see CRON_SECRET below.
 */

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' });

  const CRON_SECRET = process.env.CRON_SECRET;
  const auth = (req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
  if (!CRON_SECRET || auth !== CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const SB_URL         = process.env.SUPABASE_URL;
  const SB_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
  const RESEND_KEY     = process.env.RESEND_API_KEY;
  if (!SB_URL || !SB_SERVICE_KEY || !RESEND_KEY)
    return res.status(500).json({ error: 'Server configuration error.' });

  const adminHeaders = {
    apikey: SB_SERVICE_KEY,
    Authorization: `Bearer ${SB_SERVICE_KEY}`,
    'Content-Type': 'application/json',
  };

  /* ── 1. Find the next queued newsletter that's currently in its send
     window. A row outside its window (send_after/send_before) is skipped
     in favor of the next eligible one, and stays 'queued' rather than
     being marked 'sent' — so e.g. a summer-themed send that never went
     out in time won't fire once it's out of season. ── */
  let newsletter;
  try {
    const r = await fetch(
      `${SB_URL}/rest/v1/newsletters?status=eq.queued&order=created_at.asc`,
      { headers: adminHeaders }
    );
    if (!r.ok) throw new Error(await r.text());
    const rows = await r.json();
    const today = new Date().toISOString().slice(0, 10);
    newsletter = rows.find(row =>
      (!row.send_after || today >= row.send_after) &&
      (!row.send_before || today <= row.send_before)
    );
    if (!newsletter) return res.status(200).json({ success: true, skipped: rows.length ? 'queued newsletter(s) outside send window' : 'no queued newsletter' });
  } catch (e) {
    console.error('[send-newsletter] fetch newsletter error:', e);
    return res.status(500).json({ error: 'Failed to load newsletter.' });
  }

  /* ── 2. Gather recipients: opted-in users, resolved against the auth
     admin API for a real (and confirmed) email address. ── */
  let recipients = [];
  try {
    const profRes = await fetch(
      `${SB_URL}/rest/v1/profiles?select=id,newsletter_unsub_token&notif->>updates=eq.true`,
      { headers: adminHeaders }
    );
    if (!profRes.ok) throw new Error(await profRes.text());
    const optedIn = await profRes.json();

    if (optedIn.length) {
      const byId = new Map(optedIn.map(p => [p.id, p]));
      let page = 1;
      const perPage = 200;
      let resolved = 0;
      while (resolved < optedIn.length) {
        const usersRes = await fetch(
          `${SB_URL}/auth/v1/admin/users?page=${page}&per_page=${perPage}`,
          { headers: adminHeaders }
        );
        if (!usersRes.ok) break;
        const { users } = await usersRes.json();
        if (!users || !users.length) break;
        users.forEach(u => {
          const p = byId.get(u.id);
          if (p && u.email && u.email_confirmed_at) {
            recipients.push({ email: u.email, token: p.newsletter_unsub_token, userId: u.id });
            resolved++;
          }
        });
        if (users.length < perPage) break;
        page++;
      }
    }
  } catch (e) {
    console.error('[send-newsletter] recipient lookup error:', e);
    return res.status(500).json({ error: 'Failed to resolve recipients.' });
  }

  if (!recipients.length) {
    await markSent(SB_URL, adminHeaders, newsletter.id);
    return res.status(200).json({ success: true, sent: 0, note: 'no opted-in users' });
  }

  /* ── 3. Send via Resend's batch endpoint, 90 recipients per call ──
     Each item in the batch is its own fully separate email — no
     recipient ever sees another recipient's address. ── */
  let sent = 0;
  try {
    for (let i = 0; i < recipients.length; i += 90) {
      const chunk = recipients.slice(i, i + 90).map(r => ({
        from: 'Packmates AI <newsletter@packmatesai.com>',
        to: r.email,
        subject: newsletter.subject,
        html: buildNewsletterHtml(newsletter, r.userId, r.token),
      }));
      const batchRes = await fetch('https://api.resend.com/emails/batch', {
        method: 'POST',
        headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(chunk),
      });
      if (batchRes.ok) sent += chunk.length;
      else console.error('[send-newsletter] batch send error:', await batchRes.text());
    }
  } catch (e) {
    console.error('[send-newsletter] send error:', e);
  }

  await markSent(SB_URL, adminHeaders, newsletter.id);
  return res.status(200).json({ success: true, sent, total: recipients.length });
};

async function markSent(SB_URL, adminHeaders, id) {
  try {
    await fetch(`${SB_URL}/rest/v1/newsletters?id=eq.${id}`, {
      method: 'PATCH',
      headers: adminHeaders,
      body: JSON.stringify({ status: 'sent', sent_at: new Date().toISOString() }),
    });
  } catch (e) {
    console.error('[send-newsletter] mark-sent error:', e);
  }
}

/* Same fixed set every week — a recurring "here's what our icons look
   like" flourish, independent of that week's queued content. Mixed
   local (img/) and Vercel Blob URLs are both fine here: real, permanent
   https URLs, which is what email clients need (unlike data URIs, many
   clients strip or refuse to render those). */
const ICON_SHOWCASE = [
  { src: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-YxxWewuwXdRncaZSbQNORwOieVOP39.png', label: 'Passport' },
  { src: 'https://packmatesai.com/img/camera.png', label: 'Camera' },
  { src: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-0CfnFe8TfwtwCzUStRx2sclgeZgqGI.png', label: 'Sunglasses' },
  { src: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-53doFZDyMbmChPPHfnbbPjt0Zvlzq7.png', label: 'Backpack' },
  { src: 'https://packmatesai.com/img/portable_speaker.png', label: 'Speaker' },
];

/* Same dark-mode approach as api/send-welcome-email.js — see the comment
   there for why this is needed instead of relying on client auto-invert. */
const DARK_MODE_CSS = `
      @media (prefers-color-scheme: dark) {
        body.email-bg, table.email-bg { background: #0b141c !important; }
        table.email-card { background: #101c26 !important; box-shadow: 0 4px 20px rgba(0,0,0,0.45) !important; }
        .email-text-1 { color: #eaf2f7 !important; }
        .email-text-2 { color: #9db3c2 !important; }
        .email-text-3 { color: #6c8496 !important; }
        td.email-footer { border-top-color: #223140 !important; }
        table.email-icon-chip { background: rgba(255,255,255,0.92) !important; border-color: rgba(17,58,88,0.08) !important; box-shadow: 0 2px 8px rgba(0,0,0,0.35); }
      }`;

function buildNewsletterHtml(n, userId, token) {
  const unsubUrl = `https://packmatesai.com/api/unsubscribe-newsletter?u=${encodeURIComponent(userId)}&t=${encodeURIComponent(token)}`;
  const paragraphs = n.body
    .split(/\n\s*\n/)
    .map(p => `<p class="email-text-1" style="margin:0 0 16px;color:#0a1f2e;font-size:15.5px;line-height:1.65;">${escapeHtml(p).replace(/\n/g, '<br>')}</p>`)
    .join('');
  const cta = (n.cta_text && n.cta_url) ? `
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px auto 0;">
                  <tr>
                    <td style="border-radius:12px;background-color:#0d3347;background:linear-gradient(135deg,#5f9d30,#0d3347);">
                      <a href="${escapeAttr(n.cta_url)}" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:12px;">
                        ${escapeHtml(n.cta_text)}
                      </a>
                    </td>
                  </tr>
                </table>` : '';

  /* Optional per-week custom header image (newsletters.header_image_url,
     set by hand in Table Editor). Fluid width (no fixed height) is what
     makes this look right on both desktop and mobile mail clients — it
     just scales to whatever the card's own max-width already is, same as
     the gradient header it replaces. Falls back to the default
     gradient+logo+headline banner when not set. */
  const header = n.header_image_url ? `
              <td style="padding:0;line-height:0;background:#0d3347;">
                <img src="${escapeAttr(n.header_image_url)}" width="480" alt="${escapeAttr(n.headline)}" style="display:block;width:100%;max-width:480px;height:auto;border:0;" />
              </td>` : `
              <td style="background-color:#0d3347;background:linear-gradient(135deg,#5f9d30,#0d3347);padding:28px 32px;text-align:center;">
                <img src="https://packmatesai.com/img/icon-192.png" width="44" height="44" alt="Packmates AI" style="border-radius:12px;display:block;margin:0 auto 12px;" />
                <div style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.02em;">${escapeHtml(n.headline)}</div>
              </td>`;

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <style>
      ${DARK_MODE_CSS}
    </style>
  </head>
  <body class="email-bg" style="margin:0;padding:0;background:#eef1f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="email-bg" style="background:#eef1f5;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="email-card" style="max-width:480px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 20px rgba(13,51,71,0.12);">
            <tr>${header}
            </tr>
            <tr>
              <td style="padding:20px 32px 4px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>${ICON_SHOWCASE.map(icon => `
                    <td align="center" style="padding:0 4px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" class="email-icon-chip" style="width:44px;height:44px;background:rgba(255,255,255,0.7);border:1px solid rgba(17,58,88,0.08);border-radius:13px;margin:0 auto;">
                        <tr><td align="center" valign="middle" style="width:44px;height:44px;"><img src="${icon.src}" width="24" height="24" alt="" style="display:block;" /></td></tr>
                      </table>
                      <div class="email-text-3" style="margin-top:6px;font-size:10px;font-weight:600;letter-spacing:0.02em;color:#7a9aad;">${icon.label}</div>
                    </td>`).join('')}
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 28px;">
                ${paragraphs}
                ${cta}
              </td>
            </tr>
            <tr>
              <td class="email-footer" style="padding:18px 32px 28px;border-top:1px solid #eef1f5;text-align:center;">
                <p class="email-text-3" style="margin:0;color:#7a9aad;font-size:12px;line-height:1.6;">
                  Packmates AI · <a href="https://packmatesai.com" style="color:#7a9aad;">packmatesai.com</a><br />
                  <a href="${unsubUrl}" style="color:#7a9aad;text-decoration:underline;">Unsubscribe from this newsletter</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}
function escapeAttr(s) {
  return escapeHtml(s);
}
