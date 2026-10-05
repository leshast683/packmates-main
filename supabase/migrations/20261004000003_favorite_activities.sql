-- welcomeTour.html's activity-selection slide (slide 4) was purely
-- decorative - tapping a card toggled its selected style but nothing
-- ever read the selection back out, so it was never saved anywhere.
-- Adds profiles.favorite_activities so it persists (same categories as
-- newTrip.html's own activity chips), and extends
-- get_discoverable_travelers() to return it so discover.html's real-user
-- Community Traveler cards can show a genuine "Favorite Activities"
-- list instead of the hardcoded empty array.
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS favorite_activities TEXT[] NOT NULL DEFAULT '{}';

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
  favorite_activities TEXT[],
  member_since TIMESTAMPTZ,
  trip_count BIGINT
)
LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = public
AS $$
  SELECT
    p.id, p.name, p.avatar, p.handle, p.bio, p.location, p.gender, p.favorite_activities, p.created_at,
    (SELECT COUNT(*) FROM trip_members tm WHERE tm.user_id = p.id) AS trip_count
  FROM profiles p
  WHERE p.discoverable = TRUE
    AND p.id <> auth.uid()
  ORDER BY p.created_at DESC
  LIMIT p_limit;
$$;
