-- Real multi-user trip support.
--
-- Problem this fixes: `trips` had a single `user_id` owner column, and RLS
-- restricted every operation (including UPDATE) to `auth.uid() = user_id`.
-- When someone "joined" a trip via an invite link, the client tried to
-- upsert a row with the SAME trip id but their own user_id — which RLS
-- blocks (they don't own the existing row) while the primary key blocks a
-- fresh insert. The join silently failed to sync to the joiner's account;
-- it only ever lived in that browser's localStorage.
--
-- Fix: a trip_members join table represents "who has access to this trip",
-- separate from `trips.user_id` (now just "who created it"). RLS is
-- rewritten around membership via a SECURITY DEFINER helper (avoids RLS
-- self-recursion issues). Two SECURITY DEFINER RPCs let a non-member look
-- up a trip by invite code (for the join-preview card) and actually join
-- it, without ever needing RLS to expose the whole trips table to them.

-- ── trip_members ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS trip_members (
  trip_id   TEXT REFERENCES trips(id) ON DELETE CASCADE,
  user_id   UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role      TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (trip_id, user_id)
);

-- Backfill: every existing trip's creator becomes its 'owner' member.
-- Without this, existing users would lose access to their own trips the
-- moment the new SELECT policy below goes into effect.
INSERT INTO trip_members (trip_id, user_id, role)
SELECT id, user_id, 'owner' FROM trips
WHERE user_id IS NOT NULL
ON CONFLICT (trip_id, user_id) DO NOTHING;

ALTER TABLE trip_members ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Members can view trip membership" ON trip_members;
END $$;

CREATE POLICY "Members can view trip membership" ON trip_members
  FOR SELECT USING (
    user_id = auth.uid()
    OR trip_id IN (SELECT trip_id FROM trip_members WHERE user_id = auth.uid())
  );

-- A member can remove their own membership row ("leave trip"). Deleting
-- an *owner* row this way is intentionally still allowed at the RLS layer
-- (it's their own row) — DB.deleteTrip() in auth.js only ever takes this
-- path for non-owners; an owner's "Delete" always deletes the trips row
-- itself, which cascades to trip_members anyway.
DO $$ BEGIN
  DROP POLICY IF EXISTS "Members can leave a trip" ON trip_members;
END $$;

CREATE POLICY "Members can leave a trip" ON trip_members
  FOR DELETE USING (user_id = auth.uid());

-- ── Membership check helper (SECURITY DEFINER avoids RLS recursion) ────
CREATE OR REPLACE FUNCTION is_trip_member(p_trip_id TEXT)
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM trip_members WHERE trip_id = p_trip_id AND user_id = auth.uid()
  );
$$;

-- ── trips RLS: any member can read; only the creator can write ─────────
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users own their trips" ON trips;
  DROP POLICY IF EXISTS "Trip members can view"  ON trips;
  DROP POLICY IF EXISTS "Trip owner can insert"  ON trips;
  DROP POLICY IF EXISTS "Trip owner can update"  ON trips;
  DROP POLICY IF EXISTS "Trip owner can delete"  ON trips;
END $$;

CREATE POLICY "Trip members can view" ON trips
  FOR SELECT USING (is_trip_member(id));

CREATE POLICY "Trip owner can insert" ON trips
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Trip owner can update" ON trips
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Trip owner can delete" ON trips
  FOR DELETE USING (auth.uid() = user_id);

-- Auto-add the creator as 'owner' in trip_members on every new trip.
CREATE OR REPLACE FUNCTION handle_new_trip()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO trip_members (trip_id, user_id, role)
  VALUES (NEW.id, NEW.user_id, 'owner')
  ON CONFLICT (trip_id, user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_trip_created ON trips;
CREATE TRIGGER on_trip_created
  AFTER INSERT ON trips
  FOR EACH ROW EXECUTE FUNCTION handle_new_trip();

-- invite_code becomes a real server-side lookup key now (previously
-- unused by the backend — joining only ever worked via localStorage or a
-- full trip payload embedded in the share URL).
CREATE UNIQUE INDEX IF NOT EXISTS trips_invite_code_key ON trips (invite_code)
  WHERE invite_code IS NOT NULL;

-- ── Join flow: two SECURITY DEFINER RPCs ────────────────────────────────
-- preview_trip_by_code: read-only, minimal fields, safe to call before
-- joining (powers the "Trip preview" card in joinTrip.html without
-- exposing the full trip row or packing state to a non-member).
CREATE OR REPLACE FUNCTION preview_trip_by_code(p_invite_code TEXT)
RETURNS TABLE (destination TEXT, from_date TEXT, to_date TEXT, travelers INT)
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT
    data->>'destination',
    data->>'fromDate',
    data->>'toDate',
    (data->>'travelers')::INT
  FROM trips t
  WHERE invite_code = p_invite_code;
$$;

-- join_trip_by_code: adds the caller as a member and returns the full
-- trip row so the client can populate localStorage. Idempotent — joining
-- a trip you're already a member of just re-returns it.
CREATE OR REPLACE FUNCTION join_trip_by_code(p_invite_code TEXT)
RETURNS trips
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_trip trips;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  SELECT * INTO v_trip FROM trips WHERE invite_code = p_invite_code;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid invite code';
  END IF;

  INSERT INTO trip_members (trip_id, user_id, role)
  VALUES (v_trip.id, auth.uid(), 'member')
  ON CONFLICT (trip_id, user_id) DO NOTHING;

  RETURN v_trip;
END;
$$;
