-- Push notifications (real OS-level pushes, delivered even when the app
-- is fully closed - distinct from the existing in-app notifications.html
-- feed, which only shows things while someone has the app open).
--
-- device_tokens: one row per (user, device) FCM registration token,
-- written directly by the client (lib/push-notifications.js) the same
-- way every other user-owned table in this app is - via the browser/app's
-- own Supabase session, governed by RLS below. Vercel cron functions read
-- across all users' tokens with the service role key, which bypasses RLS
-- entirely, to actually send.
CREATE TABLE IF NOT EXISTS device_tokens (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  token      TEXT NOT NULL,
  platform   TEXT DEFAULT 'ios',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, token)
);

ALTER TABLE device_tokens ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users manage own device tokens" ON device_tokens;
END $$;

CREATE POLICY "Users manage own device tokens" ON device_tokens
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- last_active_at: pinged by the client (DB.pingActive(), throttled to at
-- most once/hour locally) on every app/dashboard open, so the inactivity
-- cron can tell who hasn't opened the app in a while. Already covered by
-- profiles' existing owner-update RLS policy - no new policy needed.
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ DEFAULT NOW();

-- push_log: idempotency guard for the reminder crons - a trip's 3-day and
-- 1-day reminder must each fire at most once ever, no matter how many
-- times (or how close together) the daily cron happens to run. Rows with
-- a trip_id are permanently deduped by the partial unique index below;
-- inactivity_nudge rows (trip_id NULL) instead get spacing-checked by the
-- cron itself (query the most recent one, skip if too recent) since a
-- person can legitimately receive more than one over time.
-- Server-only table (written by cron functions using the service role
-- key, which bypasses RLS) - RLS enabled with no policies denies every
-- direct client request, anon or authenticated.
CREATE TABLE IF NOT EXISTS push_log (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id  UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  trip_id  TEXT REFERENCES trips(id) ON DELETE CASCADE,
  type     TEXT NOT NULL, -- 'trip_reminder_3d' | 'trip_reminder_1d' | 'weather_change' | 'inactivity_nudge'
  sent_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS push_log_trip_type_once
  ON push_log (user_id, trip_id, type) WHERE trip_id IS NOT NULL;

ALTER TABLE push_log ENABLE ROW LEVEL SECURITY;

-- trip_weather_snapshot: last weather condition/temp seen for a trip's
-- destination, so the weather-change cron can tell "materially different
-- from last time" apart from "same as last time, don't renotify" apart
-- from "first time checking this trip, nothing to compare yet."
-- Server-only, same reasoning as push_log.
CREATE TABLE IF NOT EXISTS trip_weather_snapshot (
  trip_id    TEXT PRIMARY KEY REFERENCES trips(id) ON DELETE CASCADE,
  code       INT,
  temp       INT,
  checked_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE trip_weather_snapshot ENABLE ROW LEVEL SECURITY;
