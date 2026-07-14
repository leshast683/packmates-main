-- Two gaps found by re-reading the social features shipped in 0010/0011:
--
-- 1. notifications.js listens for trip_members INSERT/DELETE to tell an
--    OWNER "X joined your trip" — but the person who was just ADDED (via
--    add_packmate_to_trip) or REMOVED (via remove_trip_member) never
--    hears about it themselves. They just silently gain or lose a trip.
--    To notify the added person without also firing a redundant "you
--    were added" toast right after someone's own voluntary
--    join_trip_by_code() call, the client needs to tell the two cases
--    apart — hence `added_by`, set to the acting user's id at insert
--    time (equal to the new member's own id for a self-join, different
--    for an owner-initiated add).
--
-- 2. get_my_packmates() returns a shared-trip *count* but not which trip
--    made two people packmates in the first place — the client can't
--    say "packmates since Bali" without it.

-- ── added_by provenance on trip_members ─────────────────────────────
ALTER TABLE trip_members
  ADD COLUMN IF NOT EXISTS added_by UUID REFERENCES auth.users(id);

-- Backfill: best-effort. For existing rows we don't know the true actor,
-- so treat every existing membership as self-added (matches the actual
-- history for every row created before this migration, since
-- add_packmate_to_trip didn't exist until 0011).
UPDATE trip_members SET added_by = user_id WHERE added_by IS NULL;

CREATE OR REPLACE FUNCTION handle_new_trip()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO trip_members (trip_id, user_id, role, added_by)
  VALUES (NEW.id, NEW.user_id, 'owner', NEW.user_id)
  ON CONFLICT (trip_id, user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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

  INSERT INTO trip_members (trip_id, user_id, role, added_by)
  VALUES (v_trip.id, auth.uid(), 'member', auth.uid())
  ON CONFLICT (trip_id, user_id) DO NOTHING;

  RETURN v_trip;
END;
$$;

CREATE OR REPLACE FUNCTION add_packmate_to_trip(p_trip_id TEXT, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_owner UUID;
  v_is_packmate BOOLEAN;
BEGIN
  SELECT user_id INTO v_owner FROM trips WHERE id = p_trip_id;
  IF v_owner IS NULL OR v_owner <> auth.uid() THEN
    RAISE EXCEPTION 'Only the trip owner can add members';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM trip_members tm1
    JOIN trip_members tm2 ON tm2.trip_id = tm1.trip_id AND tm2.user_id = p_user_id
    WHERE tm1.user_id = auth.uid() AND tm2.user_id <> auth.uid()
  ) INTO v_is_packmate;
  IF NOT v_is_packmate THEN
    RAISE EXCEPTION 'You can only add someone you''ve already shared a trip with — send them an invite code instead';
  END IF;

  INSERT INTO trip_members (trip_id, user_id, role, added_by)
  VALUES (p_trip_id, p_user_id, 'member', auth.uid())
  ON CONFLICT (trip_id, user_id) DO NOTHING;
  RETURN TRUE;
END;
$$;

-- ── get_my_packmates(): add "packmates since which trip" ────────────
-- Return-column shape is changing, which Postgres won't allow via a
-- plain CREATE OR REPLACE — drop first.
DROP FUNCTION IF EXISTS get_my_packmates();

CREATE FUNCTION get_my_packmates()
RETURNS TABLE (
  user_id UUID,
  name TEXT,
  avatar TEXT,
  shared_trip_count BIGINT,
  first_shared_trip_id TEXT,
  first_shared_destination TEXT
)
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  WITH shared AS (
    SELECT
      tm2.user_id,
      tm2.trip_id,
      t.data->>'destination' AS destination,
      -- the later of the two joins is when the relationship actually
      -- formed (both people have to be members for it to count)
      GREATEST(tm1.joined_at, tm2.joined_at) AS became_packmates_at
    FROM trip_members tm1
    JOIN trip_members tm2 ON tm2.trip_id = tm1.trip_id AND tm2.user_id <> auth.uid()
    JOIN trips t ON t.id = tm2.trip_id
    WHERE tm1.user_id = auth.uid()
  )
  SELECT
    p.id,
    p.name,
    p.avatar,
    COUNT(DISTINCT s.trip_id) AS shared_trip_count,
    (ARRAY_AGG(s.trip_id ORDER BY s.became_packmates_at ASC))[1] AS first_shared_trip_id,
    (ARRAY_AGG(s.destination ORDER BY s.became_packmates_at ASC))[1] AS first_shared_destination
  FROM shared s
  JOIN profiles p ON p.id = s.user_id
  GROUP BY p.id, p.name, p.avatar
  ORDER BY shared_trip_count DESC, p.name ASC;
$$;
