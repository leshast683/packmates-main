/**
 * /api/notify-trip-reminders — fired daily by Vercel Cron (see
 * vercel.json's `crons`). Sends a real push notification (via Firebase
 * Cloud Messaging, delivered even if the app is closed) to every member
 * of a trip starting in exactly 3 days, and again for exactly 1 day,
 * using each person's own device_tokens rows.
 *
 * Idempotent: claims each (user, trip, reminder type) via an INSERT into
 * push_log with resolution=ignore-duplicates *before* sending - only a
 * successful claim (no prior row existed) actually sends, so re-running
 * this (or an overlapping invocation) can never double-notify the same
 * person for the same trip/type.
 *
 * Guard: only Vercel Cron (or a manual call carrying the same secret) may
 * trigger this — see CRON_SECRET below, same pattern as
 * api/send-newsletter.js.
 */
const { sendToTokens } = require('./_fcm');
const { pushCopy } = require('./_push-copy');

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

  function dateInDays(n) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  }

  const TARGETS = [
    { type: 'trip_reminder_3d', copyKey: 'tripReminder3d', date: dateInDays(3) },
    { type: 'trip_reminder_1d', copyKey: 'tripReminder1d', date: dateInDays(1) },
  ];

  let totalSent = 0;
  let totalClaims = 0;

  try {
    for (const target of TARGETS) {
      const tripsRes = await fetch(
        `${SB_URL}/rest/v1/trips?select=id,user_id,data&data->>fromDate=eq.${target.date}`,
        { headers: adminHeaders }
      );
      if (!tripsRes.ok) { console.error('[notify-trip-reminders] trips fetch failed:', await tripsRes.text()); continue; }
      const trips = await tripsRes.json();

      for (const trip of trips) {
        const dest = trip.data && trip.data.destination;
        if (!dest) continue;

        /* Everyone who should be reminded: the owner, plus anyone who
           joined via invite code (trip_members). */
        const membersRes = await fetch(
          `${SB_URL}/rest/v1/trip_members?trip_id=eq.${encodeURIComponent(trip.id)}&select=user_id`,
          { headers: adminHeaders }
        );
        const members = membersRes.ok ? await membersRes.json() : [];
        const userIds = new Set([trip.user_id, ...members.map(m => m.user_id)]);

        for (const userId of userIds) {
          if (!userId) continue;

          /* Claim first - only proceed to actually send if this insert
             wasn't silently dropped by the partial unique index. */
          const claimRes = await fetch(`${SB_URL}/rest/v1/push_log`, {
            method: 'POST',
            headers: { ...adminHeaders, Prefer: 'return=representation,resolution=ignore-duplicates' },
            body: JSON.stringify({ user_id: userId, trip_id: trip.id, type: target.type }),
          });
          if (!claimRes.ok) { console.error('[notify-trip-reminders] claim failed:', await claimRes.text()); continue; }
          const claimed = await claimRes.json();
          if (!Array.isArray(claimed) || !claimed.length) continue; // already sent before
          totalClaims++;

          const tokensRes = await fetch(
            `${SB_URL}/rest/v1/device_tokens?user_id=eq.${userId}&select=token`,
            { headers: adminHeaders }
          );
          const tokenRows = tokensRes.ok ? await tokensRes.json() : [];
          const tokens = tokenRows.map(r => r.token);
          if (!tokens.length) continue; // claimed (won't retry), but no device to send to

          const profRes = await fetch(
            `${SB_URL}/rest/v1/profiles?id=eq.${userId}&select=language`,
            { headers: adminHeaders }
          );
          const profRows = profRes.ok ? await profRes.json() : [];
          const lang = (profRows[0] && profRows[0].language) || 'en';

          const { title, body } = pushCopy(lang, target.copyKey, dest);
          const { successCount, invalidTokens } = await sendToTokens(tokens, {
            title, body, data: { type: target.type, tripId: trip.id },
          });
          totalSent += successCount;

          if (invalidTokens.length) {
            await fetch(`${SB_URL}/rest/v1/device_tokens?token=in.(${invalidTokens.map(t => `"${t}"`).join(',')})`, {
              method: 'DELETE', headers: adminHeaders,
            }).catch(() => {});
          }
        }
      }
    }
  } catch (e) {
    console.error('[notify-trip-reminders] error:', e);
    return res.status(500).json({ error: 'Failed to send trip reminders.' });
  }

  return res.status(200).json({ success: true, claimed: totalClaims, sent: totalSent });
};
