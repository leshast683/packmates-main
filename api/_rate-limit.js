/**
 * Shared per-user rate limiter backed by api_rate_limits (server-only,
 * RLS-enabled, zero client-facing policies - see its migration). Always
 * called with the service-role key, never a user's own JWT, so there is
 * no REST endpoint a client could hit to read or reset their own count
 * (the predecessor of this - tracking the limit in profiles.brief_count
 * and writing it with the caller's own token - was exactly that bug,
 * confirmed exploitable via a direct PATCH to /rest/v1/profiles).
 */
async function checkRateLimit({ userId, endpoint, maxPerHour, SB_URL, SERVICE_KEY }) {
  const headers = {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
  };

  let row = null;
  try {
    const res = await fetch(
      `${SB_URL}/rest/v1/api_rate_limits?user_id=eq.${userId}&endpoint=eq.${encodeURIComponent(endpoint)}&select=count,window_start`,
      { headers }
    );
    if (res.ok) { const rows = await res.json(); row = rows[0] || null; }
  } catch { /* fail open below - a rate-limit outage shouldn't take the whole endpoint down */ }

  const now = Date.now();
  const windowStart = row?.window_start ? new Date(row.window_start).getTime() : 0;
  const windowAge = now - windowStart;
  const count = row?.count || 0;
  const windowExpired = !row || windowAge >= 3_600_000;

  if (!windowExpired && count >= maxPerHour) {
    const resetIn = Math.ceil((3_600_000 - windowAge) / 60_000);
    return { allowed: false, resetIn };
  }

  const newCount = windowExpired ? 1 : count + 1;
  const newWindowStart = windowExpired ? new Date(now).toISOString() : row.window_start;

  /* Fire-and-tracked, not awaited inline - the caller decides when to
     wait on this (same pattern destination-brief.js already used:
     overlap it with the real work, settle it before returning). */
  const writePromise = fetch(`${SB_URL}/rest/v1/api_rate_limits`, {
    method: 'POST',
    headers: { ...headers, Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ user_id: userId, endpoint, count: newCount, window_start: newWindowStart }),
  }).catch(() => {});

  return { allowed: true, writePromise };
}

module.exports = { checkRateLimit };
