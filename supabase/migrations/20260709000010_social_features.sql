-- Real social features, built on the trip_members table added in 0001.
-- Two SECURITY DEFINER RPCs, following the same pattern as
-- preview_trip_by_code/join_trip_by_code: return only what's needed
-- (name + avatar), never the full profiles row, which has PII columns
-- (pd_email, pd_phone) that trip-mates have no reason to see. Both
-- functions gate on the caller actually being a trip member themselves
-- before returning anything.

-- Who's on a given trip — powers real member avatars on
-- tripPreview.html/packing-list.html, replacing the placeholder dots
-- that were rendered from a plain numeric "travelers" count.
CREATE OR REPLACE FUNCTION get_trip_member_profiles(p_trip_id TEXT)
RETURNS TABLE (user_id UUID, name TEXT, avatar TEXT, role TEXT)
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT p.id, p.name, p.avatar, tm.role
  FROM trip_members tm
  JOIN profiles p ON p.id = tm.user_id
  WHERE tm.trip_id = p_trip_id
    AND is_trip_member(p_trip_id) -- caller must themselves be a member
  ORDER BY tm.role = 'owner' DESC, tm.joined_at ASC;
$$;

-- Real "packmates": everyone you've actually shared a trip with, derived
-- from trip_members rather than the old localStorage mock list. Ordered
-- by how many trips you've shared — your most frequent travel partners
-- first.
CREATE OR REPLACE FUNCTION get_my_packmates()
RETURNS TABLE (user_id UUID, name TEXT, avatar TEXT, shared_trip_count BIGINT)
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT p.id, p.name, p.avatar, COUNT(DISTINCT tm2.trip_id) AS shared_trip_count
  FROM trip_members tm1
  JOIN trip_members tm2 ON tm2.trip_id = tm1.trip_id AND tm2.user_id <> auth.uid()
  JOIN profiles p ON p.id = tm2.user_id
  WHERE tm1.user_id = auth.uid()
  GROUP BY p.id, p.name, p.avatar
  ORDER BY shared_trip_count DESC, p.name ASC;
$$;

-- ── Community Travelers: real users, opt-in only ────────────────────────
-- There was no existing "visible to other users" concept anywhere in the
-- app — every profile setting that exists (analytics/personalise/share)
-- is about telemetry, not public visibility. Silently showing every real
-- signup's name/avatar to the whole community without consent would be a
-- real privacy regression, so this adds an explicit opt-in flag
-- (default OFF) rather than exposing anyone by default. Community
-- Travelers on the client blends this with the existing bot list —
-- real users only ever appear here if they turned this on themselves.
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS discoverable BOOLEAN NOT NULL DEFAULT FALSE;

CREATE OR REPLACE FUNCTION get_discoverable_travelers(p_limit INT DEFAULT 12)
RETURNS TABLE (user_id UUID, name TEXT, avatar TEXT, handle TEXT)
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT id, name, avatar, handle
  FROM profiles
  WHERE discoverable = TRUE
    AND id <> auth.uid()
  ORDER BY updated_at DESC
  LIMIT p_limit;
$$;
