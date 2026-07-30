/**
 * /api/send-welcome-email — sends a one-time "Welcome to Packmates" email
 * via Resend, fired by welcome.html right after a confirmation-link redirect
 * lands with a real session (i.e. right after the address is confirmed).
 * Guards: CORS · JWT auth via Supabase REST · idempotent claim via
 * profiles.welcome_email_sent (service-role key) so a retry or a race
 * between tabs/frames can never double-send.
 */

const ALLOWED_ORIGINS = ['https://packmatesai.com', 'https://www.packmatesai.com'];

module.exports = async function handler(req, res) {
  /* ── CORS ── */
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  /* ── Payload size guard (no body expected) ── */
  const contentLength = parseInt(req.headers['content-length'] || '0', 10);
  if (contentLength > 512) return res.status(413).json({ error: 'Request too large.' });

  const SB_URL         = process.env.SUPABASE_URL;
  const SB_KEY         = process.env.SUPABASE_ANON_KEY;
  const SB_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
  const RESEND_KEY     = process.env.RESEND_API_KEY;
  if (!SB_URL || !SB_KEY || !SB_SERVICE_KEY || !RESEND_KEY)
    return res.status(500).json({ error: 'Server configuration error.' });

  /* ── Verify caller's JWT and that the address is actually confirmed ── */
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
  if (!token) return res.status(401).json({ error: 'Authentication required.' });

  let userId, userEmail;
  try {
    const r = await fetch(`${SB_URL}/auth/v1/user`, {
      headers: { apikey: SB_KEY, Authorization: `Bearer ${token}` },
    });
    if (!r.ok) return res.status(401).json({ error: 'Invalid or expired session.' });
    const u = await r.json();
    userId = u?.id;
    userEmail = u?.email;
    if (!userId || !userEmail) return res.status(401).json({ error: 'Invalid session.' });
    if (!u?.email_confirmed_at) return res.status(403).json({ error: 'Email not confirmed yet.' });
  } catch {
    return res.status(401).json({ error: 'Could not verify session.' });
  }

  const adminHeaders = {
    apikey: SB_SERVICE_KEY,
    Authorization: `Bearer ${SB_SERVICE_KEY}`,
    'Content-Type': 'application/json',
  };

  /* ── Claim the send: flip the flag only if it's still false. An empty
     result means someone else already claimed it (retry / race) — bail
     out quietly rather than sending a duplicate. ── */
  let name = '';
  try {
    const claimRes = await fetch(
      `${SB_URL}/rest/v1/profiles?id=eq.${userId}&welcome_email_sent=eq.false`,
      {
        method: 'PATCH',
        headers: { ...adminHeaders, Prefer: 'return=representation' },
        body: JSON.stringify({ welcome_email_sent: true }),
      }
    );
    if (!claimRes.ok) {
      console.error('[send-welcome-email] claim failed:', await claimRes.text());
      return res.status(500).json({ error: 'Failed to send welcome email.' });
    }
    const claimed = await claimRes.json();
    if (!claimed.length) return res.status(200).json({ success: true, skipped: true });
    name = claimed[0]?.name || '';
  } catch (e) {
    console.error('[send-welcome-email] claim error:', e);
    return res.status(500).json({ error: 'Failed to send welcome email.' });
  }

  const firstName = name.trim().split(/\s+/)[0] || 'there';

  try {
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Packmates AI <welcome@packmatesai.com>',
        to: userEmail,
        subject: 'Welcome to Packmates AI 🧳',
        html: buildWelcomeEmailHtml(firstName),
      }),
    });
    if (!emailRes.ok) {
      console.error('[send-welcome-email] Resend error:', await emailRes.text());
      return res.status(500).json({ error: 'Failed to send welcome email.' });
    }
  } catch (e) {
    console.error('[send-welcome-email] send error:', e);
    return res.status(500).json({ error: 'Failed to send welcome email.' });
  }

  return res.status(200).json({ success: true });
};

/* Dark-mode support: `color-scheme` meta + this override block tells
   clients we've handled dark mode ourselves, so they don't fall back to
   their own auto-invert heuristic (which otherwise can mangle the brand
   gradient/colors unpredictably). Inline styles stay as the light-mode
   values for clients that ignore <style> blocks entirely (old Outlook);
   !important is required here since inline style otherwise always wins
   over a stylesheet regardless of specificity. */
const DARK_MODE_CSS = `
      @media (prefers-color-scheme: dark) {
        body.email-bg, table.email-bg { background: #0b141c !important; }
        table.email-card { background: #101c26 !important; box-shadow: 0 4px 20px rgba(0,0,0,0.45) !important; }
        .email-text-1 { color: #eaf2f7 !important; }
        .email-text-2 { color: #9db3c2 !important; }
        .email-text-3 { color: #6c8496 !important; }
        td.email-footer { border-top-color: #223140 !important; }
      }`;

function buildWelcomeEmailHtml(firstName) {
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
            <tr>
              <td style="background:linear-gradient(135deg,#113a58,#0d3347);padding:36px 32px;text-align:center;">
                <img src="https://packmatesai.com/img/icon-192.png" width="56" height="56" alt="Packmates" style="border-radius:14px;display:block;margin:0 auto 16px;" />
                <div style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.02em;">Welcome to Packmates AI, ${escapeHtml(firstName)}!</div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <p class="email-text-1" style="margin:0 0 16px;color:#0a1f2e;font-size:16px;line-height:1.6;">
                  Your account is confirmed and ready to go. Packmates AI builds smart, weather-aware packing lists for every trip — so you never over-pack, under-pack, or forget the one thing you actually needed.
                </p>
                <p class="email-text-2" style="margin:0 0 24px;color:#3d5a70;font-size:15px;line-height:1.6;">
                  Here's what you can do right away:
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                  <tr>
                    <td width="44" valign="top" style="padding:0 12px 16px 0;">
                      <table role="presentation" cellpadding="0" cellspacing="0" style="width:36px;height:36px;background:rgba(17,58,88,0.1);border-radius:11px;">
                        <tr><td align="center" valign="middle" style="width:36px;height:36px;"><img src="https://packmatesai.com/img/notif_trip.png" width="20" height="20" alt="" style="display:block;" /></td></tr>
                      </table>
                    </td>
                    <td valign="middle" class="email-text-1" style="padding:0 0 16px;color:#0a1f2e;font-size:15px;line-height:1.5;">
                      Create a trip and get a packing list tailored to your destination's real forecast
                    </td>
                  </tr>
                  <tr>
                    <td width="44" valign="top" style="padding:0 12px 16px 0;">
                      <table role="presentation" cellpadding="0" cellspacing="0" style="width:36px;height:36px;background:rgba(12,122,122,0.1);border-radius:11px;">
                        <tr><td align="center" valign="middle" style="width:36px;height:36px;"><img src="https://packmatesai.com/img/notif_social.png" width="20" height="20" alt="" style="display:block;" /></td></tr>
                      </table>
                    </td>
                    <td valign="middle" class="email-text-1" style="padding:0 0 16px;color:#0a1f2e;font-size:15px;line-height:1.5;">
                      Invite packmates to share the same list and split what to bring
                    </td>
                  </tr>
                  <tr>
                    <td width="44" valign="top" style="padding:0 12px 0 0;">
                      <table role="presentation" cellpadding="0" cellspacing="0" style="width:36px;height:36px;background:rgba(95,157,48,0.12);border-radius:11px;">
                        <tr><td align="center" valign="middle" style="width:36px;height:36px;"><img src="https://packmatesai.com/img/notif_achievement.png" width="20" height="20" alt="" style="display:block;" /></td></tr>
                      </table>
                    </td>
                    <td valign="middle" class="email-text-1" style="padding:0;color:#0a1f2e;font-size:15px;line-height:1.5;">
                      Track your packing streak and level up as you travel more
                    </td>
                  </tr>
                </table>
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                  <tr>
                    <td style="border-radius:12px;background:#0c7a7a;">
                      <a href="https://packmatesai.com/newTrip.html" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:12px;">
                        Start your first trip
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="email-footer" style="padding:20px 32px 32px;border-top:1px solid #eef1f5;text-align:center;">
                <p class="email-text-3" style="margin:0;color:#7a9aad;font-size:12px;line-height:1.6;">
                  Need help? Reach us any time at <a href="mailto:support@packmatesai.com" style="color:#0c7a7a;">support@packmatesai.com</a>.<br />
                  Packmates AI · <a href="https://packmatesai.com" style="color:#7a9aad;">packmatesai.com</a>
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
