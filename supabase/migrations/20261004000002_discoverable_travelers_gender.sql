-- discover.html's traveler profile modal shows a gender line for the
-- demo travelers but could never show one for real community members -
-- get_discoverable_travelers() never selected profiles.gender in the
-- first place, so discover.html always built real travelers with
-- gender:'' regardless of what they'd actually set in their own
-- profile. Adds it alongside the existing real (not fabricated) fields.
DROP FUNCTION IF EXISTS get_discoverable_travelers(INT);

CREATE FUNCTION get_discoverable_travelers(p_limit INT DEFAULT 12)
RETURNS TABLE (
  user_id UUID,
  name TEXT,
  avatar TEXT,
  handle TEXT,
  bio TEXT,
  location TEXT,
  gender TEXT,
  member_since TIMESTAMPTZ,
  trip_count BIGINT
)
LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = public
AS $$
  SELECT
    p.id, p.name, p.avatar, p.handle, p.bio, p.location, p.gender, p.created_at,
    (SELECT COUNT(*) FROM trip_members tm WHERE tm.user_id = p.id) AS trip_count
  FROM profiles p
  WHERE p.discoverable = TRUE
    AND p.id <> auth.uid()
  ORDER BY p.created_at DESC
  LIMIT p_limit;
$$;
