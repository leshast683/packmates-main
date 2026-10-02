/**
 * Shared CRON_SECRET bearer-token check for every api/notify-*.js and
 * api/send-newsletter.js cron endpoint (all GET, all gated by Vercel
 * Cron's own Authorization header matching this secret - fine for GET
 * since these are token-gated, not cookie-session-gated, so CSRF doesn't
 * apply).
 *
 * crypto.timingSafeEqual(), not `===` - a plain string comparison returns
 * as soon as it finds a mismatched byte, so its duration leaks (in
 * theory) how many leading characters of a guess were correct. Over
 * HTTPS with Vercel's own latency jitter and a long random secret this
 * isn't practically exploitable, but it's a one-line difference to do
 * correctly. timingSafeEqual() itself throws on a length mismatch rather
 * than returning false, so that's checked first - doing so leaks only
 * that the lengths differ, not anything about the content, which is no
 * more than an attacker could already infer from the response alone.
 */
const crypto = require('crypto');

function isAuthorizedCron(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = (req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
  const a = Buffer.from(auth, 'utf8');
  const b = Buffer.from(secret, 'utf8');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

module.exports = { isAuthorizedCron };
