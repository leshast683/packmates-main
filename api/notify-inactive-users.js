/**
 * /api/notify-inactive-users — fired twice a week by Vercel Cron (see
 * vercel.json's `crons`, e.g. Monday and Thursday). Sends a gentle
 * re-engagement push (via Firebase Cloud Messaging) to anyone who hasn't
 * opened the app in INACTIVE_DAYS days, based on profiles.last_active_at
 * (pinged by the client - see index.js - on every app open, throttled to
 * once/hour locally).
 *
 * Spacing guard: skips anyone who already got an inactivity_nudge within
 * the last MIN_GAP_DAYS days, so this can't fire more than roughly twice
 * a week per person even if the cron schedule or a manual trigger runs
 * more often than intended.
 *
 * Guard: only Vercel Cron (or a manual call carrying the same secret) may
 * trigger this — see CRON_SECRET below, same pattern as
 * api/send-newsletter.js.
 */
const { sendToTokens } = require('./_fcm');
const { pushCopy } = require('./_push-copy');

const INACTIVE_DAYS = 7;
const MIN_GAP_DAYS   = 3;

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' });

  const CRON_SECRET = process.env.CRON_SECRET;
  const auth = (req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
  if (!CRON_SECRET || auth !== CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const SB_URL         = process.env.SUPABASE_URL;
  const SB_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
  if (!SB_URL || !SB_SERVICE_KEY) return res.status(500).json({ error: 'Server configuration error.' });

  const adminHeaders = {
    apikey: SB_SERVICE_KEY,
    Authorization: `Bearer ${SB_SERVICE_KEY}`,
    'Content-Type': 'application/json',
  };

  const inactiveCutoff = new Date(Date.now() - INACTIVE_DAYS * 86400000).toISOString();
  const gapCutoff      = new Date(Date.now() - MIN_GAP_DAYS * 86400000).toISOString();

  let notified = 0;

  try {
    /* Only users with at least one device token AND an inactive
       last_active_at get pulled - joining via device_tokens up front
       instead of querying every profile avoids scanning users who could
       never receive a push anyway (web-only visitors, no native app). */
    const tokenOwnersRes = await fetch(
      `${SB_URL}/rest/v1/device_tokens?select=user_id`,
      { headers: adminHeaders }
    );
    if (!tokenOwnersRes.ok) return res.status(500).json({ error: 'Failed to load device tokens.' });
    const tokenOwnerRows = await tokenOwnersRes.json();
    const candidateIds = [...new Set(tokenOwnerRows.map(r => r.user_id))];
    if (!candidateIds.length) return res.status(200).json({ success: true, notified: 0, note: 'no registered devices' });

    const profRes = await fetch(
      `${SB_URL}/rest/v1/profiles?id=in.(${candidateIds.join(',')})&last_active_at=lt.${inactiveCutoff}&select=id,language`,
      { headers: adminHeaders }
    );
    if (!profRes.ok) return res.status(500).json({ error: 'Failed to load inactive profiles.' });
    const inactiveProfiles = await profRes.json();

    for (const p of inactiveProfiles) {
      /* Full send history (not just "was one sent recently") - needed for
         two things: the spacing guard below, and picking which of the 10
         inactivityNudge variants comes next, so a person nudged
         repeatedly over time cycles through all 10 instead of ever
         repeating one back-to-back. */
      const historyRes = await fetch(
        `${SB_URL}/rest/v1/push_log?user_id=eq.${p.id}&type=eq.inactivity_nudge&select=sent_at&order=sent_at.desc`,
        { headers: adminHeaders }
      );
      const history = historyRes.ok ? await historyRes.json() : [];
      if (history.length && history[0].sent_at >= gapCutoff) continue; // too recent

      const tokensRes = await fetch(
        `${SB_URL}/rest/v1/device_tokens?user_id=eq.${p.id}&select=token`,
        { headers: adminHeaders }
      );
      const tokenRows = tokensRes.ok ? await tokensRes.json() : [];
      const tokens = tokenRows.map(r => r.token);
      if (!tokens.length) continue;

      const { title, body } = pushCopy(p.language || 'en', 'inactivityNudge', history.length);
      const { successCount, invalidTokens } = await sendToTokens(tokens, {
        title, body, data: { type: 'inactivity_nudge' },
      });

      if (successCount) {
        notified++;
        await fetch(`${SB_URL}/rest/v1/push_log`, {
          method: 'POST', headers: adminHeaders,
          body: JSON.stringify({ user_id: p.id, trip_id: null, type: 'inactivity_nudge' }),
        }).catch(() => {});
      }

      if (invalidTokens.length) {
        await fetch(`${SB_URL}/rest/v1/device_tokens?token=in.(${invalidTokens.map(t => `"${t}"`).join(',')})`, {
          method: 'DELETE', headers: adminHeaders,
        }).catch(() => {});
      }
    }
  } catch (e) {
    console.error('[notify-inactive-users] error:', e);
    return res.status(500).json({ error: 'Failed to notify inactive users.' });
  }

  return res.status(200).json({ success: true, notified });
};
