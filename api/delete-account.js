/**
 * /api/delete-account — permanently deletes the authenticated user's data and auth record.
 * Guards: CORS · JWT auth via Supabase REST · service-role key for admin deletion
 */

const ALLOWED_ORIGINS = ['https://packmatesai.com', 'https://www.packmatesai.com'];

module.exports = async function handler(req, res) {
  /* ── CORS ── */
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed.' });

  /* ── Payload size guard (no body expected on DELETE) ── */
  const contentLength = parseInt(req.headers['content-length'] || '0', 10);
  if (contentLength > 512) return res.status(413).json({ error: 'Request too large.' });

  const SB_URL         = process.env.SUPABASE_URL;
  const SB_KEY         = process.env.SUPABASE_ANON_KEY;
  const SB_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
  if (!SB_URL || !SB_KEY || !SB_SERVICE_KEY)
    return res.status(500).json({ error: 'Server configuration error.' });

  /* ── Verify caller's JWT ── */
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
  if (!token) return res.status(401).json({ error: 'Authentication required.' });

  let userId;
  try {
    const r = await fetch(`${SB_URL}/auth/v1/user`, {
      headers: { apikey: SB_KEY, Authorization: `Bearer ${token}` },
    });
    if (!r.ok) return res.status(401).json({ error: 'Invalid or expired session.' });
    const u = await r.json();
    userId = u?.id;
    if (!userId) return res.status(401).json({ error: 'Invalid session.' });
  } catch {
    return res.status(401).json({ error: 'Could not verify session.' });
  }

  const adminHeaders = {
    apikey: SB_SERVICE_KEY,
    Authorization: `Bearer ${SB_SERVICE_KEY}`,
    'Content-Type': 'application/json',
  };

  /* ── Delete user data rows (order matters for FK constraints) ── */
  try {
    await fetch(`${SB_URL}/rest/v1/packing_state?user_id=eq.${userId}`, {
      method: 'DELETE', headers: adminHeaders,
    });
    await fetch(`${SB_URL}/rest/v1/trips?user_id=eq.${userId}`, {
      method: 'DELETE', headers: adminHeaders,
    });
    await fetch(`${SB_URL}/rest/v1/profiles?id=eq.${userId}`, {
      method: 'DELETE', headers: adminHeaders,
    });
  } catch (e) {
    console.error('[delete-account] data cleanup error:', e);
    /* Non-fatal — attempt auth deletion anyway */
  }

  /* ── Delete Supabase auth user via Admin API ── */
  try {
    const delRes = await fetch(`${SB_URL}/auth/v1/admin/users/${userId}`, {
      method: 'DELETE', headers: adminHeaders,
    });
    if (!delRes.ok) {
      const body = await delRes.text();
      console.error('[delete-account] admin user delete failed:', body);
      return res.status(500).json({ error: 'Failed to delete account. Please contact support.' });
    }
  } catch (e) {
    console.error('[delete-account] admin delete error:', e);
    return res.status(500).json({ error: 'Failed to delete account.' });
  }

  return res.status(200).json({ success: true });
};
