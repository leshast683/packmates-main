-- Bug found via live testing after migration 0001: the "Members can view
-- trip membership" SELECT policy on trip_members queried trip_members
-- from within its own USING clause. Unlike is_trip_member() (used by the
-- trips/packing_state policies), that subquery was NOT wrapped in a
-- SECURITY DEFINER function — so evaluating the policy re-triggered the
-- same policy on the subquery's own access to trip_members, causing
-- Postgres to raise "infinite recursion detected in policy for relation
-- trip_members" (42P17) on any direct SELECT against the table.
--
-- Nothing in the current client code does a direct SELECT on
-- trip_members (only the "leave trip" DELETE, governed by a different,
-- non-recursive policy), so this wasn't an active blocker — but it's
-- broken SQL that would break any future feature querying membership
-- directly (e.g. a "who else is on this trip" list), so fixing it now.

CREATE OR REPLACE FUNCTION user_trip_ids()
RETURNS SETOF TEXT
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT trip_id FROM trip_members WHERE user_id = auth.uid();
$$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Members can view trip membership" ON trip_members;
END $$;

CREATE POLICY "Members can view trip membership" ON trip_members
  FOR SELECT USING (
    user_id = auth.uid()
    OR trip_id IN (SELECT user_trip_ids())
  );
