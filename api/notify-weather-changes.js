/**
 * /api/notify-weather-changes — fired by Vercel Cron (see vercel.json's
 * `crons`) once a day. For every trip starting in the next 14
 * days, re-checks the destination's forecast and pushes a notification
 * (via Firebase Cloud Messaging) to the trip's members only when the
 * weather changed *meaningfully* since the last check - a swing between
 * sunny/rainy/snowy/stormy/foggy categories, or a big temperature swing
 * within the same category - not on every minor fluctuation.
 *
 * trip_weather_snapshot holds the last-seen condition per trip: the very
 * first check for a trip just records a baseline (nothing to compare
 * against yet, so no push), and every check after that only notifies on
 * a real change, updating the snapshot either way.
 *
 * Guard: only Vercel Cron (or a manual call carrying the same secret) may
 * trigger this — see CRON_SECRET below, same pattern as
 * api/send-newsletter.js.
 */
const { sendToTokens } = require('./_fcm');
const { pushCopy, hashToIndex } = require('./_push-copy');

/* Same category buckets as index.js's wxAnimClass() - a code change
   within the same bucket (e.g. 0 "sunny" -> 1 "mostly sunny") isn't
   worth a push on its own. */
function weatherCategory(code) {
  if (code === 0 || code === 1) return 'sunny';
  if (code === 2 || code === 3) return 'cloudy';
  if (code === 45 || code === 48) return 'foggy';
  if (code >= 51 && code <= 67) return 'rainy';
  if (code >= 71 && code <= 77) return 'snowy';
  if (code >= 80 && code <= 82) return 'rainy';
  if (code >= 95 && code <= 99) return 'stormy';
  return 'other';
}

const TEMP_SWING_THRESHOLD_F = 15;

async function fetchCurrentWeather(destination, lang) {
  try {
    /* lang must match whatever language this destination's name was
       stored in (newTrip.html's destinationLang) - Open-Meteo's
       geocoding search only matches a name against that exact
       language's alternate-names table, confirmed empirically (an
       unparametrized or mismatched-language query against a non-English
       name returns zero results, even for well-known cities). */
    const geo = await (await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(destination)}&count=1&language=${lang || 'en'}`)).json();
    const place = geo.results && geo.results[0];
    if (!place) return null;
    const w = await (await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=auto`)).json();
    if (!w.current) return null;
    return { code: w.current.weather_code, temp: Math.round(w.current.temperature_2m) };
  } catch { return null; }
}

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

  const today = new Date().toISOString().slice(0, 10);
  const in14 = new Date(); in14.setUTCDate(in14.getUTCDate() + 14);
  const in14Str = in14.toISOString().slice(0, 10);

  let checked = 0, notified = 0;

  try {
    const tripsRes = await fetch(
      `${SB_URL}/rest/v1/trips?select=id,user_id,data&data->>fromDate=gte.${today}&data->>fromDate=lte.${in14Str}`,
      { headers: adminHeaders }
    );
    if (!tripsRes.ok) return res.status(500).json({ error: 'Failed to load trips.' });
    const trips = await tripsRes.json();

    for (const trip of trips) {
      const dest = trip.data && trip.data.destination;
      if (!dest) continue;

      const current = await fetchCurrentWeather(dest, trip.data && trip.data.destinationLang);
      if (!current) continue;
      checked++;

      const snapRes = await fetch(
        `${SB_URL}/rest/v1/trip_weather_snapshot?trip_id=eq.${encodeURIComponent(trip.id)}&select=code,temp`,
        { headers: adminHeaders }
      );
      const snapRows = snapRes.ok ? await snapRes.json() : [];
      const prev = snapRows[0];

      const meaningfulChange = prev && (
        weatherCategory(prev.code) !== weatherCategory(current.code) ||
        Math.abs(prev.temp - current.temp) >= TEMP_SWING_THRESHOLD_F
      );

      /* Upsert the snapshot regardless - it's always "what we most
         recently saw", whether or not this check triggered a push. */
      await fetch(`${SB_URL}/rest/v1/trip_weather_snapshot`, {
        method: 'POST',
        headers: { ...adminHeaders, Prefer: 'resolution=merge-duplicates' },
        body: JSON.stringify({ trip_id: trip.id, code: current.code, temp: current.temp, checked_at: new Date().toISOString() }),
      }).catch(() => {});

      if (!meaningfulChange) continue;

      const membersRes = await fetch(
        `${SB_URL}/rest/v1/trip_members?trip_id=eq.${encodeURIComponent(trip.id)}&select=user_id`,
        { headers: adminHeaders }
      );
      const members = membersRes.ok ? await membersRes.json() : [];
      const userIds = new Set([trip.user_id, ...members.map(m => m.user_id)]);

      for (const userId of userIds) {
        if (!userId) continue;
        const tokensRes = await fetch(
          `${SB_URL}/rest/v1/device_tokens?user_id=eq.${userId}&select=token`,
          { headers: adminHeaders }
        );
        const tokenRows = tokensRes.ok ? await tokensRes.json() : [];
        const tokens = tokenRows.map(r => r.token);
        if (!tokens.length) continue;

        const profRes = await fetch(
          `${SB_URL}/rest/v1/profiles?id=eq.${userId}&select=language`,
          { headers: adminHeaders }
        );
        const profRows = profRes.ok ? await profRes.json() : [];
        const lang = (profRows[0] && profRows[0].language) || 'en';

        const variantIndex = hashToIndex(trip.id + current.code + '_' + current.temp, 5);
        const { title, body } = pushCopy(lang, 'weatherChange', variantIndex, dest);
        const { successCount, invalidTokens } = await sendToTokens(tokens, {
          title, body, data: { type: 'weather_change', tripId: trip.id },
        });
        if (successCount) notified++;

        if (invalidTokens.length) {
          await fetch(`${SB_URL}/rest/v1/device_tokens?token=in.(${invalidTokens.map(t => `"${t}"`).join(',')})`, {
            method: 'DELETE', headers: adminHeaders,
          }).catch(() => {});
        }
      }
    }
  } catch (e) {
    console.error('[notify-weather-changes] error:', e);
    return res.status(500).json({ error: 'Failed to check weather changes.' });
  }

  return res.status(200).json({ success: true, checked, notified });
};
