/**
 * Shared Firebase Cloud Messaging sender, used by every notify-*.js cron.
 * Requires FIREBASE_SERVICE_ACCOUNT_JSON (a Vercel env var holding the
 * full JSON key downloaded from Firebase Console → Project Settings →
 * Service Accounts → Generate new private key) - see
 * supabase/migrations/20260927000003_push_notifications.sql's header
 * comment and the project README for the one-time Firebase/APNs setup
 * this depends on.
 */
const admin = require('firebase-admin');

let _app = null;
function _getApp() {
  if (_app) return _app;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  let creds;
  try { creds = JSON.parse(raw); } catch { return null; }
  _app = admin.apps.length
    ? admin.app()
    : admin.initializeApp({ credential: admin.credential.cert(creds) });
  return _app;
}

/**
 * Sends one notification to a batch of FCM tokens (max 500 per Firebase's
 * own limit - callers with more should chunk before calling this).
 * Returns { successCount, invalidTokens: string[] } so the caller can
 * prune device_tokens rows that Firebase reports as dead
 * (unregistered/not-found - the device uninstalled the app, or the token
 * rotated) instead of retrying them forever.
 */
async function sendToTokens(tokens, { title, body, data } = {}) {
  const app = _getApp();
  if (!app || !tokens.length) return { successCount: 0, invalidTokens: [] };

  const message = {
    tokens,
    notification: { title, body },
    data: Object.fromEntries(Object.entries(data || {}).map(([k, v]) => [k, String(v)])),
    apns: { payload: { aps: { sound: 'default' } } },
  };

  try {
    const res = await admin.messaging(app).sendEachForMulticast(message);
    const invalidTokens = [];
    res.responses.forEach((r, i) => {
      if (!r.success) {
        const code = r.error && r.error.code;
        if (code === 'messaging/registration-token-not-registered' || code === 'messaging/invalid-registration-token') {
          invalidTokens.push(tokens[i]);
        }
      }
    });
    return { successCount: res.successCount, invalidTokens };
  } catch (e) {
    console.error('[fcm] send error:', e.message || e);
    return { successCount: 0, invalidTokens: [] };
  }
}

module.exports = { sendToTokens };
