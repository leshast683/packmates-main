/**
 * /api/pexels — Pexels search proxy
 * Keeps the Pexels API key server-side instead of shipping it in client JS.
 */

const ALLOWED_ORIGINS = ['https://packmatesai.com', 'https://www.packmatesai.com'];
const MAX_QUERY_LEN = 100;

module.exports = async function handler(req, res) {
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' });

  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Server configuration error.' });

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
    return res.status(r.status).json(data);
  } catch {
    return res.status(500).json({ error: 'Image service temporarily unavailable.' });
  }
};
