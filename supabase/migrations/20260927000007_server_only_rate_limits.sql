-- api/destination-brief.js's 20-calls/hour rate limit was tracked in
-- profiles.brief_count/brief_window_start, read and WRITTEN using the
-- caller's own JWT (relying on the generic "users can update their own
-- profile" RLS policy that exists for legitimate profile editing).
-- Verified empirically: any user can
-- `PATCH /rest/v1/profiles?id=eq.<self> {"brief_count":0}` directly
-- against the public REST API, with no endpoint involved, instantly
-- resetting their own limit - the control was client-writable and gave
-- no real protection against unlimited paid-API usage.
--
-- Moves both this and api/pexels.js's (previously nonexistent) rate
-- limit into one server-only table, same pattern as push_log: RLS
-- enabled, zero client-facing policies, so it's only ever readable/
-- writable via the service-role key from inside the API handler itself
-- - never from the browser, regardless of whose JWT is used.
CREATE TABLE IF NOT EXISTS api_rate_limits (
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint     TEXT NOT NULL,
  count        INT NOT NULL DEFAULT 0,
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, endpoint)
);
ALTER TABLE api_rate_limits ENABLE ROW LEVEL SECURITY;

-- The old client-writable counter columns are superseded by the table
-- above and no longer read by any endpoint - dropped so they can't be
-- mistaken for a still-active control.
ALTER TABLE profiles DROP COLUMN IF EXISTS brief_count;
ALTER TABLE profiles DROP COLUMN IF EXISTS brief_window_start;
