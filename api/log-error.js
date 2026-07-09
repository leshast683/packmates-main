/**
 * /api/log-error — persists client-side errors to Supabase
 * Fire-and-forget from the client; never blocks the UI. Auth required so
 * anonymous requests can't flood the table — errors are attributed to the
 * logged-in user via their own Supabase JWT (RLS enforces auth.uid() = user_id).
 */

const ALLOWED_ORIGINS = ['https://packmatesai.com', 'https://www.packmatesai.com'];
const MAX_FIELD_LEN = 2000;

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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  const contentLength = parseInt(req.headers['content-length'] || '0', 10);
  if (contentLength > 8192) return res.status(413).json({ error: 'Request too large.' });

  const SB_URL = process.env.SUPABASE_URL;
  const SB_KEY = process.env.SUPABASE_ANON_KEY;
  if (!SB_URL || !SB_KEY) return res.status(500).json({ error: 'Server configuration error.' });

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

  const { message, stack, page, context } = req.body || {};
  if (!message) return res.status(400).json({ error: 'Missing message.' });

  const row = {
    user_id: userId,
    page: strip(page, 200),
    message: strip(message, MAX_FIELD_LEN),
    stack: strip(stack, MAX_FIELD_LEN),
    context: context && typeof context === 'object' ? context : {},
    user_agent: strip(req.headers['user-agent'], 300),
  };

  try {
    const r = await fetch(`${SB_URL}/rest/v1/error_logs`, {
      method: 'POST',
      headers: {
        apikey: SB_KEY,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
    });
    if (!r.ok) return res.status(500).json({ error: 'Could not store error log.' });
    return res.status(204).end();
  } catch {
    return res.status(500).json({ error: 'Log service temporarily unavailable.' });
  }
};
