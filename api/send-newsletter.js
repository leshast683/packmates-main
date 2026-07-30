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
   clients strip or refuse to render those). Used by the default layout
   only — the alternate layouts below (checklist/badges) bring their own
   themed icon sets instead. */
const ICON_SHOWCASE = [
  { src: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-YxxWewuwXdRncaZSbQNORwOieVOP39.png', label: 'Passport' },
  { src: 'https://packmatesai.com/img/camera.png', label: 'Camera' },
  { src: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-0CfnFe8TfwtwCzUStRx2sclgeZgqGI.png', label: 'Sunglasses' },
  { src: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-53doFZDyMbmChPPHfnbbPjt0Zvlzq7.png', label: 'Backpack' },
  { src: 'https://packmatesai.com/img/portable_speaker.png', label: 'Speaker' },
];

/* Themed icon sets for newsletters.layout = 'city-checklist' / 'cold-checklist'.
   Matched positionally to the "tip" paragraphs in the row's `body` (i.e.
   every paragraph except the first and last, which are treated as
   intro/outro prose) — see renderChecklistContent(). */
const LAYOUT_ICON_SETS = {
  'city-checklist': [
    'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-KuYCB2ggXWqJ9fLErN8ArVlWCqFtTU.png', // charger
    'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-53doFZDyMbmChPPHfnbbPjt0Zvlzq7.png', // backpack
    'https://packmatesai.com/img/walking_shoes.png',
  ],
  'cold-checklist': [
    'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-elw4GyvNsROSSzsDAUmaiKotqamYXy.png', // jacket
    'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-f6aak6Yv0iNA0ticTbBK4UWIFFmhbc.png', // gloves
    'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-SK0Aaj1m2uTI5PZjoFR0OG5vvC2LnS.png', // beanie
    'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-dRTPgE3MmCK504LAdEjKyEec0G0Iiy.png', // lip balm
  ],
};

/* newsletters.layout = 'badges' shows the real 6-tier badge progression
   (same art as profile.html's level system) instead of a generic icon
   set — the icons ARE the feature being described. */
const BADGE_STRIP = [
  { src: 'https://packmatesai.com/img/badge_beginner.png', label: 'Beginner' },
  { src: 'https://packmatesai.com/img/badge_adventurer.png', label: 'Adventurer' },
  { src: 'https://packmatesai.com/img/badge_wanderer.png', label: 'Wanderer' },
  { src: 'https://packmatesai.com/img/badge_explorer.png', label: 'Explorer' },
  { src: 'https://packmatesai.com/img/badge_globetrotter.png', label: 'Globetrotter' },
  { src: 'https://packmatesai.com/img/badge_world_citizen.png', label: 'World Citizen' },
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

/* One icon+text row for the checklist layouts — the icon sits in the same
   .email-icon-chip square used elsewhere so dark-mode handling is free. */
function buildTipRow(iconSrc, text) {
  return `
                  <tr>
                    <td width="50" valign="top" style="padding:0 12px 14px 0;">
                      <table role="presentation" cellpadding="0" cellspacing="0" class="email-icon-chip" style="width:40px;height:40px;background:rgba(255,255,255,0.7);border:1px solid rgba(17,58,88,0.08);border-radius:12px;">
                        <tr><td align="center" valign="middle" style="width:40px;height:40px;"><img src="${iconSrc}" width="22" height="22" alt="" style="display:block;" /></td></tr>
                      </table>
                    </td>
                    <td valign="middle" class="email-text-1" style="padding:0 0 14px;color:#0a1f2e;font-size:14.5px;line-height:1.5;">${text}</td>
                  </tr>`;
}

/* Tip copy is written as "Short label — detail." — bold the label, keep
   the detail as regular text. Falls back to plain text if it doesn't
   follow that shape. */
function formatTipText(raw) {
  const idx = raw.indexOf(' — ');
  if (idx === -1) return escapeHtml(raw);
  return `<strong>${escapeHtml(raw.slice(0, idx))}</strong> — ${escapeHtml(raw.slice(idx + 3))}`;
}

/* layout: 'city-checklist' | 'cold-checklist'. A paragraph is a tip row
   (icon + text, matched positionally to that layout's icon set) only if
   it starts with "• " — everything else is prose, rendered wherever it
   falls in the body. That marker (rather than "first/last paragraph")
   is what lets a row have more than one intro or outro paragraph without
   it accidentally being parsed as a tip. 'cold-checklist' additionally
   gets a stat callout box up top, since "average temp vs. real feel" is
   the whole point of that send. */
function renderChecklistContent(n) {
  const icons = LAYOUT_ICON_SETS[n.layout] || [];
  const paras = n.body.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);

  let body = '';
  let tipRows = '';
  let tipIdx = 0;
  const flushTips = () => {
    if (!tipRows) return;
    body += `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 16px;">${tipRows}
                </table>`;
    tipRows = '';
  };
  paras.forEach(p => {
    if (p.startsWith('• ')) {
      tipRows += buildTipRow(icons[tipIdx % icons.length], formatTipText(p.slice(2).trim()));
      tipIdx++;
    } else {
      flushTips();
      body += `<p class="email-text-1" style="margin:0 0 16px;color:#0a1f2e;font-size:15.5px;line-height:1.65;">${escapeHtml(p)}</p>`;
    }
  });
  flushTips();

  const statBlock = n.layout === 'cold-checklist' ? `
            <tr>
              <td style="padding:20px 32px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="email-icon-chip" style="background:rgba(255,255,255,0.7);border:1px solid rgba(17,58,88,0.08);border-radius:16px;">
                  <tr>
                    <td align="center" style="padding:16px 20px;">
                      <!-- Fixed (not theme-flipping) colors on purpose: this box's
                           .email-icon-chip background is forced bright/white in dark
                           mode too, so its text must stay dark regardless of theme —
                           using .email-text-* here would turn the text light and make
                           it vanish against the still-light box. -->
                      <div style="font-size:10px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#7a9aad;margin-bottom:6px;">Average vs. real feel</div>
                      <div style="font-size:26px;font-weight:800;">
                        <span style="color:#0a1f2e;">40°F</span>
                        <span style="color:#7a9aad;font-size:15px;">&nbsp;&rarr;&nbsp;</span>
                        <span style="color:#0c7a7a;">20°F</span>
                      </div>
                      <div style="font-size:12px;color:#3d5a70;margin-top:4px;">that's the number your jacket actually needs to handle</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>` : '';

  return `${statBlock}
            <tr>
              <td style="padding:${n.layout === 'cold-checklist' ? '16px' : '24px'} 32px 8px;">
                ${body}
              </td>
            </tr>`;
}

/* layout: 'badges' — shows the real 6-tier level progression instead of
   a generic icon set, since the icons ARE the feature being promoted.
   Rendered as a 3-column x 2-row grid (not one row of 6 + connecting
   arrows) — a single row of 6 fixed-width icons plus arrow columns
   doesn't fit a phone-width card without overflowing; a grid does. */
function renderBadgesContent(n) {
  const paras = n.body.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const intro = paras[0];
  const outroParas = paras.slice(1);

  const cells = BADGE_STRIP.map(b => `
                    <td align="center" width="33%" style="padding:0 4px 16px;">
                      <img src="${b.src}" width="40" height="40" alt="${escapeAttr(b.label)}" style="display:block;margin:0 auto 5px;" />
                      <div class="email-text-3" style="font-size:10px;font-weight:600;color:#7a9aad;">${escapeHtml(b.label)}</div>
                    </td>`);
  const strip = `
                  <tr>${cells.slice(0, 3).join('')}</tr>
                  <tr>${cells.slice(3, 6).join('')}</tr>`;

  const outroHtml = outroParas
    .map(p => `<p class="email-text-2" style="margin:0 0 12px;color:#3d5a70;font-size:14px;line-height:1.6;">${escapeHtml(p)}</p>`)
    .join('');

  return `
            <tr>
              <td style="padding:24px 32px 8px;">
                <p class="email-text-1" style="margin:0 0 18px;color:#0a1f2e;font-size:15.5px;line-height:1.65;">${escapeHtml(intro)}</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
                  ${strip}
                </table>
                ${outroHtml}
              </td>
            </tr>`;
}

/* Default layout (no newsletters.layout set) — the original design: a
   fixed icon-showcase strip, then plain prose paragraphs. */
function renderDefaultContent(n) {
  const paragraphs = n.body
    .split(/\n\s*\n/)
    .map(p => `<p class="email-text-1" style="margin:0 0 16px;color:#0a1f2e;font-size:15.5px;line-height:1.65;">${escapeHtml(p).replace(/\n/g, '<br>')}</p>`)
    .join('');
  return `
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
              <td style="padding:16px 32px 8px;">
                ${paragraphs}
              </td>
            </tr>`;
}

function buildNewsletterHtml(n, userId, token) {
  const unsubUrl = `https://packmatesai.com/api/unsubscribe-newsletter?u=${encodeURIComponent(userId)}&t=${encodeURIComponent(token)}`;
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

  /* Per-week layout (newsletters.layout, set by hand in Table Editor):
     'city-checklist' / 'cold-checklist' → icon+text tip rows (cold also
     gets a stat callout); 'badges' → the real level-progression strip;
     anything else (including unset) → the original icon-showcase design. */
  const content = n.layout === 'city-checklist' || n.layout === 'cold-checklist'
    ? renderChecklistContent(n)
    : n.layout === 'badges'
      ? renderBadgesContent(n)
      : renderDefaultContent(n);

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
            ${content}
            <tr>
              <td style="padding:8px 32px 28px;text-align:center;">
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
