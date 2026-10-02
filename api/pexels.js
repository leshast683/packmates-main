/**
 * /api/pexels — Pexels search proxy
 * Keeps the Pexels API key server-side instead of shipping it in client JS.
 * Requires a logged-in user and rate-limits per user - otherwise this is
 * an open, effectively unmetered proxy (any logged-in user could script
 * unlimited requests) to a quota-limited third-party API shared by every
 * Packmates user.
 */
const { checkRateLimit } = require('./_rate-limit');

const ALLOWED_ORIGINS = ['https://packmatesai.com', 'https://www.packmatesai.com'];
const MAX_QUERY_LEN = 100;
const MAX_CALLS_PER_HOUR = 60;

module.exports = async function handler(req, res) {
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' });

  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Server configuration error.' });

  const SB_URL = process.env.SUPABASE_URL;
  const SB_KEY = process.env.SUPABASE_ANON_KEY;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
  if (!SB_URL || !SB_KEY || !SERVICE_KEY) return res.status(500).json({ error: 'Server configuration error.' });

  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
  if (!token) return res.status(401).json({ error: 'Authentication required.' });
  let userId;
  try {
    const userRes = await fetch(`${SB_URL}/auth/v1/user`, {
      headers: { apikey: SB_KEY, Authorization: `Bearer ${token}` }
    });
    if (!userRes.ok) return res.status(401).json({ error: 'Invalid or expired session.' });
    const userData = await userRes.json();
    userId = userData?.id;
    if (!userId) return res.status(401).json({ error: 'Invalid session.' });
  } catch {
    return res.status(401).json({ error: 'Could not verify session.' });
  }

  /* Backed by api_rate_limits (service-role-only) - without this, any
     logged-in user could script unlimited requests against Pexels'
     shared, quota-limited API key, exhausting it for every Packmates
     user. */
  const rl = await checkRateLimit({
    userId, endpoint: 'pexels', maxPerHour: MAX_CALLS_PER_HOUR, SB_URL, SERVICE_KEY,
  });
  if (!rl.allowed) {
    return res.status(429).json({
      error: `Rate limit reached (${MAX_CALLS_PER_HOUR}/hr). Try again in ${rl.resetIn} minute${rl.resetIn !== 1 ? 's' : ''}.`
    });
  }

  const { query, type, per_page, orientation } = req.query || {};
  const safeQuery = String(query || '').trim().slice(0, MAX_QUERY_LEN);
  if (!safeQuery) return res.status(400).json({ error: 'Missing query.' });

  const safePerPage = Math.min(Math.max(parseInt(per_page, 10) || 5, 1), 15);
  const safeOrientation = ['landscape', 'portrait', 'square'].includes(orientation) ? orientation : 'landscape';
  const endpoint = type === 'videos' ? 'videos/search' : 'v1/search';

  try {
    const r = await fetch(
      `https://api.pexels.com/${endpoint}?query=${encodeURIComponent(safeQuery)}&orientation=${safeOrientation}&per_page=${safePerPage}`,
      { headers: { Authorization: apiKey } }
    );
    const data = await r.json();
    await rl.writePromise;
    return res.status(r.status).json(data);
  } catch {
    await rl.writePromise;
    return res.status(500).json({ error: 'Image service temporarily unavailable.' });
  }
};
