-- Migration 4's membership check still wasn't blocking non-members after
-- being re-run — live re-test confirmed the write still succeeds. Root
-- cause: supabase-schema.sql's own comments note packing_state has had
-- two historical policy names ("Users own their packing state" and an
-- older "Users can manage own packing state"). Migration 4 only dropped
-- the first. Postgres combines multiple PERMISSIVE policies for the same
-- command with OR — so if the old, unrestricted-by-membership policy was
-- still present under its other name, it alone was enough to let any
-- write through regardless of the new stricter policy sitting next to it.
--
-- This drops every known name variant before recreating, and lists the
-- table's actual policies at the end so the result is visible immediately
-- instead of trusting that the DROP silently worked.

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users own their packing state"       ON packing_state;
  DROP POLICY IF EXISTS "Users can manage own packing state"  ON packing_state;
END $$;

CREATE POLICY "Users own their packing state" ON packing_state
  FOR ALL
  USING (auth.uid() = user_id AND is_trip_member(trip_id))
  WITH CHECK (auth.uid() = user_id AND is_trip_member(trip_id));

-- Same legacy-name residue is possible on trips (supabase-schema.sql
-- notes "Users can manage own trips" as an older name). It hasn't caused
-- a behavioral bug there — its auth.uid()=user_id scope happens to match
-- what the new owner-only write policies already allow, and owners are
-- always members so it doesn't broaden read access either — but it's the
-- same kind of leftover, so clearing it out for real while already here.
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can manage own trips" ON trips;
END $$;

-- Run this and confirm exactly ONE row comes back, with using_clause
-- mentioning is_trip_member. More than one row means another permissive
-- policy is still layered on top and needs to be found and dropped too.
SELECT polname, pg_get_expr(polqual, polrelid) AS using_clause
FROM pg_policy
WHERE polrelid = 'packing_state'::regclass;
