/**
 * /api/unsubscribe-newsletter — one-click unsubscribe link clicked from
 * the weekly newsletter's footer. No login required: the token embedded
 * in the link (profiles.newsletter_unsub_token) proves the request is
 * legitimate, verified server-side via the unsubscribe_newsletter() RPC
 * (supabase/migrations/20260729000002_weekly_newsletter.sql).
 */

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).send('Method not allowed.');

  const { u: userId, t: token } = req.query;
  const SB_URL         = process.env.SUPABASE_URL;
  const SB_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  if (!SB_URL || !SB_SERVICE_KEY || !userId || !token) {
    return res.status(400).send(renderPage(
      'Something went wrong',
      "This unsubscribe link is missing information. Please contact support@packmatesai.com."
    ));
  }

  try {
    const r = await fetch(`${SB_URL}/rest/v1/rpc/unsubscribe_newsletter`, {
      method: 'POST',
      headers: {
        apikey: SB_SERVICE_KEY,
        Authorization: `Bearer ${SB_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ p_user_id: userId, p_token: token }),
    });
    const ok = r.ok && (await r.json()) === true;

    if (ok) {
      return res.status(200).send(renderPage(
        "You're unsubscribed",
        "You won't receive the Packmates AI newsletter anymore. You can turn it back on anytime from Profile → Settings in the app."
      ));
    }
    return res.status(400).send(renderPage(
      'Link expired or invalid',
      "We couldn't verify this unsubscribe link. If you keep receiving emails, contact support@packmatesai.com."
    ));
  } catch (e) {
    console.error('[unsubscribe-newsletter] error:', e);
    return res.status(500).send(renderPage(
      'Something went wrong',
      'Please try again later or contact support@packmatesai.com.'
    ));
  }
};

function renderPage(title, message) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${title} — Packmates AI</title>
  </head>
  <body style="margin:0;background:#eef1f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px;">
    <div style="max-width:420px;width:100%;background:#ffffff;border-radius:20px;box-shadow:0 4px 20px rgba(13,51,71,0.12);padding:36px 32px;text-align:center;">
      <div style="font-size:20px;font-weight:700;color:#0a1f2e;margin-bottom:10px;">${title}</div>
      <p style="color:#3d5a70;font-size:14.5px;line-height:1.6;margin:0 0 20px;">${message}</p>
      <a href="https://packmatesai.com" style="color:#0c7a7a;font-weight:600;font-size:14px;text-decoration:none;">Back to Packmates AI →</a>
    </div>
  </body>
</html>`;
}
