-- The policy audit (via _diag_list_policies(), migration 0007) found a
-- THIRD set of orphaned policies that predate even supabase-schema.sql's
-- own "older name variant" comments — they were never documented
-- anywhere, so migration 0006's cleanup (which only knew about the two
-- documented legacy names) couldn't have caught them:
--
--   packing_state: 'own packing'  FOR ALL  USING (auth.uid() = user_id)
--   trips:         'own trips'    FOR ALL  USING (auth.uid() = user_id)
--   profiles:      'own profile'  FOR ALL  USING (auth.uid() = id)
--
-- 'own packing' is the actual root cause of the bug 0006 was supposed to
-- fix but didn't — it has no is_trip_member() check, and Postgres
-- OR-combines permissive policies, so it alone let non-members write
-- packing_state regardless of every other policy. Confirmed via live
-- re-test after 0006 supposedly applied: still broken, until this.
--
-- 'own trips' and 'own profile' aren't currently causing a behavioral
-- difference (their auth.uid()=user_id scope is the same as what the
-- current-named policies already allow), but they're the same kind of
-- undocumented leftover — dropping them now rather than leaving another
-- landmine for later.

DO $$ BEGIN
  DROP POLICY IF EXISTS "own packing" ON packing_state;
  DROP POLICY IF EXISTS "own trips"   ON trips;
  DROP POLICY IF EXISTS "own profile" ON profiles;
END $$;

-- Re-run the audit inline so the result is visible immediately: this
-- should now show exactly ONE policy per (table, command) combination,
-- with packing_state's using_expr mentioning is_trip_member.
SELECT table_name, policy_name, command, using_expr
FROM _diag_list_policies()
ORDER BY table_name, command;
