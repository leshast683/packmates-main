-- packing_state RLS only ever checked row ownership (auth.uid() = user_id),
-- not actual trip membership. A user could write a packing_state row for
-- any trip_id string, even one they were never added to — it didn't leak
-- data (they could still only see their own row), but it's a looseness
-- worth closing now that is_trip_member() exists as the natural check.
-- This also means: leaving a trip (removing the trip_members row) now
-- correctly cuts off read/write access to that trip's packing_state too,
-- even in the edge case where the row wasn't explicitly deleted on leave.

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users own their packing state" ON packing_state;
END $$;

CREATE POLICY "Users own their packing state" ON packing_state
  FOR ALL
  USING (auth.uid() = user_id AND is_trip_member(trip_id))
  WITH CHECK (auth.uid() = user_id AND is_trip_member(trip_id));

-- trip_members' only index is the composite primary key (trip_id, user_id),
-- which doesn't serve a user_id-only lookup — used by the "Members can
-- view trip membership" policy's subquery.
CREATE INDEX IF NOT EXISTS trip_members_user_id_idx ON trip_members (user_id);
