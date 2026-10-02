-- Security event log for suspicious authentication activity (failed
-- logins, etc.) - previously nothing in this codebase recorded these;
-- Supabase Auth's own internal logs capture some of this but aren't
-- queryable from the app. Server-only (RLS enabled, zero client-facing
-- policies, same pattern as push_log/api_rate_limits) - written only via
-- the service-role key from api/security-event.js, never with a user's
-- own token, since the whole point is to still work when there ISN'T a
-- valid session (that's exactly what a failed login is).
CREATE TABLE IF NOT EXISTS security_events (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  email      TEXT,
  ip         TEXT,
  context    JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS security_events_type_created_idx ON security_events (event_type, created_at DESC);
