/**
 * /api/destination-brief — secured AI endpoint
 * Guards: CORS origin check · JWT auth · per-user rate limit · input sanitisation
 */

const ALLOWED_ORIGINS = ['https://packmatesai.com', 'https://www.packmatesai.com'];
const MAX_CALLS_PER_HOUR = 20;   // per authenticated user
const MAX_DEST_LEN  = 120;
const MAX_CTRY_LEN  = 80;
const MAX_DATES_LEN = 40;

function strip(str, max) {
  return String(str ?? '').replace(/[<>'"`;]/g, '').trim().slice(0, max);
}

module.exports = async function handler(req, res) {
  /* ── CORS ────────────────────────────────────────────────────────── */
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed.' });

  /* ── Payload size guard (4 KB max) ──────────────────────────────────── */
  const contentLength = parseInt(req.headers['content-length'] || '0', 10);
  if (contentLength > 4096) return res.status(413).json({ error: 'Request too large.' });
  const rawBody = JSON.stringify(req.body || '');
  if (rawBody.length > 4096) return res.status(413).json({ error: 'Request too large.' });

  const SB_URL = process.env.SUPABASE_URL;
  const SB_KEY = process.env.SUPABASE_ANON_KEY;
  if (!SB_URL || !SB_KEY) return res.status(500).json({ error: 'Server configuration error.' });

  /* ── Auth: verify Supabase JWT ───────────────────────────────────── */
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
  if (!token) return res.status(401).json({ error: 'Authentication required.' });

  let userId;
  try {
    const userRes = await fetch(`${SB_URL}/auth/v1/user`, {
      headers: { apikey: SB_KEY, Authorization: `Bearer ${token}` }
    });
    if (!userRes.ok) return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
    const userData = await userRes.json();
    userId = userData?.id;
    if (!userId) return res.status(401).json({ error: 'Invalid session.' });
  } catch {
    return res.status(401).json({ error: 'Could not verify session.' });
  }

  /* ── Rate limiting: 20 calls / hour / user ───────────────────────── */
  /* The counter PATCH below is bookkeeping — it's kicked off but not
     awaited here, then picked back up (Promise.allSettled) right before
     the Claude response returns. That runs it concurrently with the
     Claude call instead of serially in front of it (a full extra
     Supabase round-trip previously sat on the critical path of every
     "Before You Go" load), while still finishing before the function's
     execution ends — unlike true fire-and-forget, which risks the
     invocation being torn down before a dangling promise completes. */
  let rateLimitWrite = Promise.resolve();
  try {
    const profileRes = await fetch(
      `${SB_URL}/rest/v1/profiles?id=eq.${userId}&select=brief_count,brief_window_start`,
      { headers: { apikey: SB_KEY, Authorization: `Bearer ${token}` } }
    );
    if (profileRes.ok) {
      const [profile] = await profileRes.json();
      if (profile) {
        const now = Date.now();
        const windowStart = profile.brief_window_start ? new Date(profile.brief_window_start).getTime() : 0;
        const windowAge   = now - windowStart;
        const count       = profile.brief_count || 0;

        if (windowAge < 3_600_000 && count >= MAX_CALLS_PER_HOUR) {
          const resetIn = Math.ceil((3_600_000 - windowAge) / 60_000);
          return res.status(429).json({
            error: `Rate limit reached (${MAX_CALLS_PER_HOUR}/hr). Try again in ${resetIn} minute${resetIn !== 1 ? 's' : ''}.`
          });
        }

        const newCount       = windowAge >= 3_600_000 ? 1 : count + 1;
        const newWindowStart = windowAge >= 3_600_000 ? new Date().toISOString() : profile.brief_window_start;
        rateLimitWrite = fetch(`${SB_URL}/rest/v1/profiles?id=eq.${userId}`, {
          method:  'PATCH',
          headers: {
            apikey: SB_KEY, Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', Prefer: 'return=minimal'
          },
          body: JSON.stringify({ brief_count: newCount, brief_window_start: newWindowStart })
        });
      }
    }
  } catch { /* non-fatal — allow request through if rate-limit check fails */ }

  /* ── Input validation & sanitisation ────────────────────────────── */
  const { destination, country, dates } = req.body || {};
  if (!destination || !country) return res.status(400).json({ error: 'Missing destination or country.' });

  const safeDest    = strip(destination, MAX_DEST_LEN);
  const safeCountry = strip(country,     MAX_CTRY_LEN);
  const safeDates   = dates ? strip(dates, MAX_DATES_LEN) : null;

  if (!safeDest || !safeCountry) return res.status(400).json({ error: 'Invalid destination or country.' });

  /* ── Claude call ─────────────────────────────────────────────────── */
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'AI service not configured.' });

  const prompt = `You are a concise travel assistant. Return ONLY valid JSON (no markdown, no explanation) for a trip to ${safeDest}, ${safeCountry} around ${safeDates || 'the trip dates'}.

{
  "visa": "One sentence on visa requirements for US/EU passport holders.",
  "currency": "One sentence: local currency name, symbol, and one practical tip.",
  "weather": "One sentence: expected temperature range and conditions for ${safeDates || 'the travel period'}.",
  "safety": "One sentence: general safety level and the single most important precaution.",
  "packingTips": ["2 to 3 short weather-specific packing items that aren't already obvious"]
}`;

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await r.json();
    /* By now the rate-limit PATCH kicked off earlier has almost certainly
       already settled in the background (it's a single fast Supabase
       write vs. the Claude call above) — awaiting it here just confirms
       it finishes within this invocation's lifetime, at effectively no
       added latency. */
    await rateLimitWrite.catch(() => {});
    const text = data?.content?.[0]?.text || '';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return res.status(500).json({ error: 'Bad AI response.' });

    res.setHeader('Cache-Control', 'public, max-age=86400');
    try {
      return res.json(JSON.parse(match[0]));
    } catch {
      return res.status(500).json({ error: 'AI returned a malformed response.' });
    }
  } catch {
    await rateLimitWrite.catch(() => {});
    return res.status(500).json({ error: 'AI service temporarily unavailable.' });
  }
};
