-- Two more SECURITY DEFINER RPCs, same trust model as the rest of the
-- trip_members work: every check happens inside the function, never
-- relying on the client to behave.

-- Owner removes a specific member from their trip. Only the trip's
-- actual owner (trips.user_id) can do this — a member can already
-- remove themselves via the existing "Members can leave a trip" RLS
-- policy, this is the other direction.
CREATE OR REPLACE FUNCTION remove_trip_member(p_trip_id TEXT, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_owner UUID;
BEGIN
  SELECT user_id INTO v_owner FROM trips WHERE id = p_trip_id;
  IF v_owner IS NULL OR v_owner <> auth.uid() THEN
    RAISE EXCEPTION 'Only the trip owner can remove a member';
  END IF;
  IF p_user_id = v_owner THEN
    RAISE EXCEPTION 'The owner cannot remove themselves this way — delete the trip instead';
  END IF;

  DELETE FROM packing_state WHERE trip_id = p_trip_id AND user_id = p_user_id;
  DELETE FROM trip_members WHERE trip_id = p_trip_id AND user_id = p_user_id;
  RETURN FOUND;
END;
$$;

-- Owner adds someone directly from their real Packmates list (people
-- they've actually shared a trip with before — see get_my_packmates()).
-- This is NOT a general "add any stranger" tool: it only succeeds if
-- the target is already a genuine packmate of the CALLER, which stands
-- in for consent given the established prior travel relationship. A
-- true stranger can only ever join via a real invite code.
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

  INSERT INTO trip_members (trip_id, user_id, role)
  VALUES (p_trip_id, p_user_id, 'member')
  ON CONFLICT (trip_id, user_id) DO NOTHING;
  RETURN TRUE;
END;
$$;
