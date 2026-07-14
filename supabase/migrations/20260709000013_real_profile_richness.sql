-- profile.html already has working bio/location inputs (edit-bio,
-- edit-location) whose values get merged into the pm_profile object and
-- passed to DB.saveProfile() — but auth.js's saveProfile/syncProfile
-- never actually listed bio/location among the columns they read or
-- write, and profiles never had columns for them. The values silently
-- never left localStorage, which is why every real user's Community
-- Travelers card falls back to "This traveler hasn't added a bio yet."
-- regardless of what they actually typed.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS bio      TEXT,
  ADD COLUMN IF NOT EXISTS location TEXT;

-- Backstop only (UI already caps bio at 50 chars) — same pattern as the
-- other size constraints in 0003.
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_bio_length;
ALTER TABLE profiles ADD CONSTRAINT profiles_bio_length
  CHECK (bio IS NULL OR char_length(bio) <= 200);

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_location_length;
ALTER TABLE profiles ADD CONSTRAINT profiles_location_length
  CHECK (location IS NULL OR char_length(location) <= 100);

-- get_discoverable_travelers(): return the real bio/location plus two
-- more real (not fabricated) fields — join date, and a trip *count*.
-- Trip count only, never destinations: "has used the app N times" isn't
-- sensitive, but exposing WHERE someone actually traveled to a stranger
-- just because they flipped a general "show me in Community Travelers"
-- toggle would be — that's a materially bigger disclosure than they
-- opted into.
DROP FUNCTION IF EXISTS get_discoverable_travelers(INT);

CREATE FUNCTION get_discoverable_travelers(p_limit INT DEFAULT 12)
RETURNS TABLE (
  user_id UUID,
  name TEXT,
  avatar TEXT,
  handle TEXT,
  bio TEXT,
  location TEXT,
  member_since TIMESTAMPTZ,
  trip_count BIGINT
)
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT
    p.id, p.name, p.avatar, p.handle, p.bio, p.location, p.created_at,
    (SELECT COUNT(*) FROM trip_members tm WHERE tm.user_id = p.id) AS trip_count
  FROM profiles p
  WHERE p.discoverable = TRUE
    AND p.id <> auth.uid()
  ORDER BY p.created_at DESC
  LIMIT p_limit;
$$;
