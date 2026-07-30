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

/* Backward-compat only: the icon sets originally hardcoded per layout name,
   from before tips could name their own icon (see ICON_LIBRARY below).
   Still used as a positional fallback for the two already-queued rows
   that predate that syntax (layout='city-checklist' / 'cold-checklist'
   with plain "Label — detail" tips, no "icon_key | " prefix) so they keep
   rendering exactly as originally approved. Don't add to this — new
   content should reference ICON_LIBRARY keys directly instead. */
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

/* Shared icon library — pulled from the same real app icon art used
   throughout packing-icons.js. Any checklist/icon-grid tip can reference
   any of these by key ("• charger | Portable charger — ..."), so new
   newsletters never need a code change to use a different icon; this map
   just needs a new entry if a future topic wants an icon not listed yet.
   Falls back to `passport` for an unrecognized key rather than erroring,
   so a typo in Table Editor degrades gracefully instead of breaking the
   send. */
const ICON_LIBRARY = {
  charger: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-KuYCB2ggXWqJ9fLErN8ArVlWCqFtTU.png',
  backpack: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-53doFZDyMbmChPPHfnbbPjt0Zvlzq7.png',
  walking_shoes: 'https://packmatesai.com/img/walking_shoes.png',
  jacket: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-elw4GyvNsROSSzsDAUmaiKotqamYXy.png',
  gloves: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-f6aak6Yv0iNA0ticTbBK4UWIFFmhbc.png',
  beanie: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-SK0Aaj1m2uTI5PZjoFR0OG5vvC2LnS.png',
  lip_balm: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-dRTPgE3MmCK504LAdEjKyEec0G0Iiy.png',
  passport: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-YxxWewuwXdRncaZSbQNORwOieVOP39.png',
  camera: 'https://packmatesai.com/img/camera.png',
  sunglasses: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-0CfnFe8TfwtwCzUStRx2sclgeZgqGI.png',
  portable_speaker: 'https://packmatesai.com/img/portable_speaker.png',
  cash: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-wnzXfGqb6aI838iS9TCufJSh2ToJP8.png',
  phone: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-4InIbjutnVbO2RgfQjb4X5InSQnbWH.png',
  power_bank: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-KUiU6Lyx7ucBrdj6KmS1tmfbFOuHht.png',
  travel_adapter: 'https://packmatesai.com/img/travel-adapter.png',
  toothbrush: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-F5zA09gQTWbAIIRCjJTQ5FT7mORctP.png',
  scarf: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-Qt5El3U2ZF2YXGHQzXibfjhxrRGHFu.png',
  boots: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-8FdFcdbAGGWvjntzWv0JfI4ZXopXxB.png',
  hiking_boots: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-IggFBTZj6FLZJOSOZIjFlIU8ntmuyv.png',
  sun_hat: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-tMMTRyfcwkP5GmHmEsBD2lZdN12BRz.png',
  panama_hat: 'https://packmatesai.com/img/panama_hat.png',
  umbrella: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-UoaYOG517tIhHK4E1CCxU83D6Add6c.png',
  ear_plugs: 'https://packmatesai.com/img/item_ear_plugs.png',
  insect_repellent: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-AkYUY4ijrAx50lIj9SJ1z5oVjn0uee.png',
  blazer: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-kMTBDO8YMouYhgo7LcVhz6KO8yiWWM.png',
  travel_pillow: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-smLqiLswTcAJ08IJnAfs3gyvfv0hlS.png',
  motion_sickness_med: 'https://packmatesai.com/img/motion_sickness_med.png',
  prescription_medication: 'https://packmatesai.com/img/prescription_medication.png',
  allergy_medication: 'https://packmatesai.com/img/allergy_medication.png',
  sunscreen: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-ixp9yadIpp3NmeQqoOdHkQHpqiwkwR.png',
  reusable_water_bottle: 'https://packmatesai.com/img/item_reusable_water_bottle.png',
  dress: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-sjnsZFCzT6VnSOqmWOg9YE53KR68pi.png',
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

/* layout: 'checklist' (also: legacy 'city-checklist' / 'cold-checklist').
   A paragraph is a tip row only if it starts with "• " — everything else
   is prose, rendered wherever it falls in the body. That marker (rather
   than "first/last paragraph") is what lets a row have more than one
   intro or outro paragraph without it accidentally being parsed as a tip.

   Tip syntax: "• icon_key | Label — detail" — icon_key is any key from
   ICON_LIBRARY. The " | icon_key" part is optional for backward
   compatibility: a tip with no pipe falls back to that layout's original
   hardcoded LAYOUT_ICON_SETS array (positional), so the two already-
   queued rows that predate per-tip icons keep rendering unchanged. */
function renderChecklistContent(n) {
  const legacyIcons = LAYOUT_ICON_SETS[n.layout] || [];
  const paras = n.body.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);

  let body = '';
  let tipRows = '';
  let legacyIdx = 0;
  const flushTips = () => {
    if (!tipRows) return;
    body += `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 16px;">${tipRows}
                </table>`;
    tipRows = '';
  };
  paras.forEach(p => {
    if (p.startsWith('• ')) {
      const raw = p.slice(2).trim();
      const pipeIdx = raw.indexOf(' | ');
      let iconSrc, text;
      if (pipeIdx !== -1) {
        iconSrc = ICON_LIBRARY[raw.slice(0, pipeIdx).trim()] || ICON_LIBRARY.passport;
        text = raw.slice(pipeIdx + 3).trim();
      } else {
        iconSrc = legacyIcons[legacyIdx % (legacyIcons.length || 1)] || ICON_LIBRARY.passport;
        text = raw;
        legacyIdx++;
      }
      tipRows += buildTipRow(iconSrc, formatTipText(text));
    } else {
      flushTips();
      body += `<p class="email-text-1" style="margin:0 0 16px;color:#0a1f2e;font-size:15.5px;line-height:1.65;">${escapeHtml(p)}</p>`;
    }
  });
  flushTips();

  /* Stat callout box — generic (newsletters.stat_left/stat_right/
     stat_caption/stat_footer, all optional), so any checklist send can
     opt into one. The already-queued cold-weather row predates those
     columns, so it falls back to its original hardcoded 40°F/20°F copy
     when they're unset and layout is still 'cold-checklist', keeping
     that row's approved appearance unchanged. */
  const hasCustomStat = n.stat_left && n.stat_right;
  const showLegacyColdStat = n.layout === 'cold-checklist' && !hasCustomStat;
  const showStat = hasCustomStat || showLegacyColdStat;
  const statCaption = hasCustomStat ? (n.stat_caption || '') : 'Average vs. real feel';
  const statLeft = hasCustomStat ? n.stat_left : '40°F';
  const statRight = hasCustomStat ? n.stat_right : '20°F';
  const statFooter = hasCustomStat ? (n.stat_footer || '') : "that's the number your jacket actually needs to handle";

  const statBlock = showStat ? `
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
                      ${statCaption ? `<div style="font-size:10px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#7a9aad;margin-bottom:6px;">${escapeHtml(statCaption)}</div>` : ''}
                      <div style="font-size:24px;font-weight:800;">
                        <span style="color:#0a1f2e;">${escapeHtml(statLeft)}</span>
                        <span style="color:#7a9aad;font-size:15px;">&nbsp;&rarr;&nbsp;</span>
                        <span style="color:#0c7a7a;">${escapeHtml(statRight)}</span>
                      </div>
                      ${statFooter ? `<div style="font-size:12px;color:#3d5a70;margin-top:4px;">${escapeHtml(statFooter)}</div>` : ''}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>` : '';

  return `${statBlock}
            <tr>
              <td style="padding:${showStat ? '16px' : '24px'} 32px 8px;">
                ${body}
              </td>
            </tr>`;
}

/* Shared by 'badges' and 'icon-grid' — a 3-column grid of icon+label
   cells (wraps to as many rows as needed), intro prose above, any
   number of outro paragraphs below. A single row of fixed-width icons
   (the original badge-strip design) doesn't fit a phone-width card once
   there are more than ~4 items; a grid does regardless of count. */
function renderIconGrid(items, intro, outroParas) {
  const cells = items.map(it => `
                    <td align="center" width="33%" style="padding:0 4px 16px;">
                      <img src="${it.src}" width="40" height="40" alt="${escapeAttr(it.label)}" style="display:block;margin:0 auto 5px;" />
                      <div class="email-text-3" style="font-size:10px;font-weight:600;color:#7a9aad;">${escapeHtml(it.label)}</div>
                    </td>`);
  let rows = '';
  for (let i = 0; i < cells.length; i += 3) rows += `\n                  <tr>${cells.slice(i, i + 3).join('')}</tr>`;

  const outroHtml = outroParas
    .map(p => `<p class="email-text-2" style="margin:0 0 12px;color:#3d5a70;font-size:14px;line-height:1.6;">${escapeHtml(p)}</p>`)
    .join('');

  return `
            <tr>
              <td style="padding:24px 32px 8px;">
                <p class="email-text-1" style="margin:0 0 18px;color:#0a1f2e;font-size:15.5px;line-height:1.65;">${escapeHtml(intro)}</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">${rows}
                </table>
                ${outroHtml}
              </td>
            </tr>`;
}

/* layout: 'badges' — shows the real 6-tier level progression instead of
   a generic icon set, since the icons ARE the feature being promoted. */
function renderBadgesContent(n) {
  const paras = n.body.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  return renderIconGrid(BADGE_STRIP, paras[0], paras.slice(1));
}

/* layout: 'icon-grid' — a general-purpose version of the badges layout
   for "here's a handful of items" content (e.g. commonly-forgotten
   items) where a description per item isn't needed, just icon + label.
   Grid items are written as "• icon_key | Label" bullet lines in `body`
   (same "• " marker convention as the checklist layout); any non-bullet
   paragraph is intro/outro prose, same rules as renderChecklistContent. */
function renderIconGridContent(n) {
  const paras = n.body.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const items = [];
  const prose = [];
  paras.forEach(p => {
    if (p.startsWith('• ')) {
      const raw = p.slice(2).trim();
      const pipeIdx = raw.indexOf(' | ');
      if (pipeIdx !== -1) {
        const key = raw.slice(0, pipeIdx).trim();
        items.push({ src: ICON_LIBRARY[key] || ICON_LIBRARY.passport, label: raw.slice(pipeIdx + 3).trim() });
      } else {
        items.push({ src: ICON_LIBRARY.passport, label: raw });
      }
    } else {
      prose.push(p);
    }
  });
  return renderIconGrid(items, prose[0] || '', prose.slice(1));
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
     'checklist' (or legacy 'city-checklist' / 'cold-checklist') → icon+text
     tip rows, optionally with a stat callout (see stat_left/stat_right);
     'icon-grid' → a general icon+label grid for "here's a handful of
     items" content; 'badges' → the real level-progression strip;
     anything else (including unset) → the original icon-showcase design. */
  const content = n.layout === 'checklist' || n.layout === 'city-checklist' || n.layout === 'cold-checklist'
    ? renderChecklistContent(n)
    : n.layout === 'icon-grid'
      ? renderIconGridContent(n)
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
