-- Extends get_discoverable_travelers() with three more genuinely-real
-- stats for Community Traveler profiles, so discover.html no longer has
-- to leave them hardcoded at 0/[] (countries, favorite_destinations) or
-- compute a meaningless "0" (items_packed, which previously summed over
-- the always-empty packingLists array - real users' packing history was
-- never fetched from anywhere).
--
--   countries              - distinct trip destinationCountry values
--                             across every trip this user is a member of
--                             (never fabricated - 0 if none are set).
--   favorite_destinations  - up to 8 distinct trip destinations, most
--                             recently traveled first.
--   items_packed           - lifetime count of packed=true entries in
--                             packing_state.item_state across every trip
--                             row this user owns packing state for. This
--                             is a genuine server-side total (unlike the
--                             self-profile's "Items Packed" stat in
--                             profile.html, which only ever reflects the
--                             current trip from localStorage) - fine for
--                             a one-off RPC read, but not something the
--                             self-view needs to match since they're
--                             different stats answering different
--                             questions ("my current trip" vs "this
--                             person's whole history").
--
-- Travel Style stays entirely client-side (derived from
-- favorite_activities in discover.html) - it's a presentation label, not
-- a fact to store.
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
  trip_count BIGINT,
  countries BIGINT,
  favorite_destinations TEXT[],
  items_packed BIGINT
)
LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = public
AS $$
  SELECT
    p.id, p.name, p.avatar, p.handle, p.bio, p.location, p.gender, p.favorite_activities, p.created_at,
    (SELECT COUNT(*) FROM trip_members tm WHERE tm.user_id = p.id) AS trip_count,
    (SELECT COUNT(DISTINCT t.data->>'destinationCountry')
       FROM trip_members tm JOIN trips t ON t.id = tm.trip_id
       WHERE tm.user_id = p.id AND COALESCE(t.data->>'destinationCountry', '') <> '') AS countries,
    (SELECT COALESCE(array_agg(dest), ARRAY[]::text[]) FROM (
       SELECT t.data->>'destination' AS dest
       FROM trip_members tm JOIN trips t ON t.id = tm.trip_id
       WHERE tm.user_id = p.id AND COALESCE(t.data->>'destination', '') <> ''
       GROUP BY t.data->>'destination'
       ORDER BY MAX(t.created_at) DESC
       LIMIT 8
     ) d) AS favorite_destinations,
    (SELECT COALESCE(SUM(
       (SELECT COUNT(*) FROM jsonb_each(ps.item_state) e WHERE (e.value->>'packed')::boolean IS TRUE)
     ), 0)
       FROM packing_state ps WHERE ps.user_id = p.id) AS items_packed
  FROM profiles p
  WHERE p.discoverable = TRUE
    AND p.id <> auth.uid()
  ORDER BY p.created_at DESC
  LIMIT p_limit;
$$;
