/**
 * /api/security-event — records suspicious authentication events
 * (currently: failed logins) to security_events (server-only table, see
 * its migration). Deliberately does NOT require a valid session - the
 * whole point is to still work when there isn't one (a failed login
 * attempt has, by definition, no valid JWT to authenticate the log
 * request with). Always writes with the service-role key, never a
 * client-supplied token.
 *
 * Because this is the one endpoint in the app that intentionally accepts
 * unauthenticated requests, it's locked down differently instead of by
 * JWT: a strict allowlist of event_type values, small field-length caps,
 * and a per-IP hourly cap on how many events this endpoint will record -
 * so it can't itself be turned into an abuse vector (log-flooding, or
 * using it to probe which emails exist by volume of attempts rather than
 * response content).
 */

const ALLOWED_ORIGINS = ['https://packmatesai.com', 'https://www.packmatesai.com'];
const ALLOWED_EVENT_TYPES = new Set(['login_failed']);
const MAX_PER_HOUR_PER_IP = 20;
const MAX_EMAIL_LEN = 320; // RFC 5321 max mailbox length

function strip(str, max) {
  return String(str ?? '').slice(0, max);
}

module.exports = async function handler(req, res) {
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  const contentLength = parseInt(req.headers['content-length'] || '0', 10);
  if (contentLength > 2048) return res.status(413).json({ error: 'Request too large.' });

  const SB_URL = process.env.SUPABASE_URL;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
  if (!SB_URL || !SERVICE_KEY) return res.status(500).json({ error: 'Server configuration error.' });

  const { event_type, email } = req.body || {};
  if (!ALLOWED_EVENT_TYPES.has(event_type)) return res.status(400).json({ error: 'Unknown event type.' });

  const ip = strip((req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress, 64);
  const adminHeaders = {
    apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
  };

  /* Best-effort per-IP throttle: this endpoint accepts no auth, so an IP
     address is the only thing to key off. Fails open (lets the event
     through) if the count check itself fails - a rate-limit outage
     shouldn't be the reason a real suspicious-login signal gets dropped. */
  try {
    if (ip) {
      const since = new Date(Date.now() - 3_600_000).toISOString();
      const countRes = await fetch(
        `${SB_URL}/rest/v1/security_events?ip=eq.${encodeURIComponent(ip)}&created_at=gte.${since}&select=id`,
        { headers: adminHeaders }
      );
      if (countRes.ok) {
        const rows = await countRes.json();
        if (rows.length >= MAX_PER_HOUR_PER_IP) return res.status(204).end(); // silently drop, don't reveal the throttle
      }
    }
  } catch { /* fail open */ }

  try {
    await fetch(`${SB_URL}/rest/v1/security_events`, {
      method: 'POST',
      headers: { ...adminHeaders, Prefer: 'return=minimal' },
      body: JSON.stringify({
        event_type,
        email: email ? strip(String(email).toLowerCase(), MAX_EMAIL_LEN) : null,
        ip: ip || null,
      }),
    });
  } catch { /* best-effort - never fail the caller's actual login flow over this */ }

  return res.status(204).end();
};
