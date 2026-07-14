-- TEMPORARY diagnostic function — not part of the app, exists only so the
-- policy audit that follows migration 0006 can be run and verified
-- programmatically instead of by hand. Safe to run: it only reads
-- pg_policies (Postgres catalog metadata), never touches app data.
--
-- Drop it after the audit is done — see
-- 20260709000008_drop_policy_audit_function.sql.

CREATE OR REPLACE FUNCTION _diag_list_policies()
RETURNS TABLE (
  table_name   TEXT,
  policy_name  TEXT,
  command      TEXT,
  permissive   TEXT,
  roles        TEXT,
  using_expr   TEXT,
  check_expr   TEXT
)
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT tablename, policyname, cmd, permissive, roles::text, qual, with_check
  FROM pg_policies
  WHERE schemaname = 'public'
  ORDER BY tablename, cmd, policyname;
$$;
