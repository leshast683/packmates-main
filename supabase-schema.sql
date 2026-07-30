-- Packmates — Supabase Schema
-- Safe to run multiple times (idempotent).
-- Paste this into Supabase SQL Editor and click "Run".

-- ── profiles ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id        UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name      TEXT,
  handle    TEXT,
  avatar    TEXT,
  gender    TEXT,
  pd_name   TEXT,
  pd_email  TEXT,
  pd_phone  TEXT,
  notif     JSONB DEFAULT '{}',
  privacy   JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add any missing columns if table already exists
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS handle    TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar    TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pd_name   TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pd_email  TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pd_phone  TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notif     JSONB DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS privacy   JSONB DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS welcome_email_sent BOOLEAN DEFAULT FALSE;

-- ── trips ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS trips (
  id           TEXT PRIMARY KEY,
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  destination  TEXT NOT NULL,
  from_date    TEXT,
  to_date      TEXT,
  travelers    INT  DEFAULT 1,
  activities   JSONB DEFAULT '[]',
  country      TEXT,
  image_url    TEXT,
  invite_code  TEXT,
  owner_email  TEXT,
  airline      TEXT,
  weather_tags JSONB DEFAULT '[]',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  data         JSONB  -- stores the full trip object for lossless round-trips
);

ALTER TABLE trips ADD COLUMN IF NOT EXISTS airline      TEXT;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS weather_tags JSONB DEFAULT '[]';
ALTER TABLE trips ADD COLUMN IF NOT EXISTS invite_code  TEXT;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS owner_email  TEXT;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS data         JSONB;

-- ── packing_state ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS packing_state (
  trip_id      TEXT REFERENCES trips(id) ON DELETE CASCADE,
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_state   JSONB DEFAULT '{}',
  dismissed    JSONB DEFAULT '[]',
  custom_items JSONB DEFAULT '{}',
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (trip_id, user_id)
);

ALTER TABLE packing_state ADD COLUMN IF NOT EXISTS item_state   JSONB DEFAULT '{}';
ALTER TABLE packing_state ADD COLUMN IF NOT EXISTS dismissed    JSONB DEFAULT '[]';
ALTER TABLE packing_state ADD COLUMN IF NOT EXISTS custom_items JSONB DEFAULT '{}';

-- ── Row Level Security ────────────────────────────────────────────────
ALTER TABLE profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips         ENABLE ROW LEVEL SECURITY;
ALTER TABLE packing_state ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to re-create cleanly
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users own their profile"       ON profiles;
  DROP POLICY IF EXISTS "Users own their trips"         ON trips;
  DROP POLICY IF EXISTS "Users own their packing state" ON packing_state;
  -- Also drop older name variants from previous runs
  DROP POLICY IF EXISTS "Users can manage own profile"       ON profiles;
  DROP POLICY IF EXISTS "Users can manage own trips"         ON trips;
  DROP POLICY IF EXISTS "Users can manage own packing state" ON packing_state;
END $$;

CREATE POLICY "Users own their profile" ON profiles
  FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Users own their trips" ON trips
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users own their packing state" ON packing_state
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ── Auto-create profile row on new signup ─────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  BEGIN
    INSERT INTO public.profiles (id, name, gender, notif)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'name', ''),
      COALESCE(NEW.raw_user_meta_data->>'gender', NULL),
      '{"updates": true}'::jsonb
    )
    ON CONFLICT (id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    -- Swallow errors so signup always succeeds
    NULL;
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── error_logs ────────────────────────────────────────────────────────
-- Client-side error reports, written via /api/log-error so failures
-- that today only show up in a user's own browser console are visible
-- to us. Best-effort/fire-and-forget from the client — never blocks the UI.
CREATE TABLE IF NOT EXISTS error_logs (
  id         BIGSERIAL PRIMARY KEY,
  user_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  page       TEXT,
  message    TEXT,
  stack      TEXT,
  context    JSONB DEFAULT '{}',
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users insert their own error logs" ON error_logs;
  DROP POLICY IF EXISTS "Users view their own error logs"   ON error_logs;
END $$;

CREATE POLICY "Users insert their own error logs" ON error_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users view their own error logs" ON error_logs
  FOR SELECT USING (auth.uid() = user_id);
