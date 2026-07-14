# Database migrations

`supabase-schema.sql` (repo root) is the original baseline — a single
idempotent file safe to paste into the Supabase SQL Editor for a fresh
project. It's kept as-is for that purpose.

Everything from here on is a **tracked, ordered migration** in this folder.
Run them in filename order (they're timestamp-prefixed) in the Supabase
SQL Editor. Each file is idempotent where practical (`IF NOT EXISTS`,
`CREATE OR REPLACE`, `DROP ... IF EXISTS` before `CREATE`), so re-running
one that already applied is safe.

If you later install the Supabase CLI, this folder already matches its
`supabase/migrations/` convention — `supabase db push` will pick these up
directly.

| File | What it does |
|---|---|
| `20260709000001_trip_members.sql` | Adds real multi-user trip support (`trip_members` table + RLS rework + join-by-code RPCs). Backfills existing trips so current owners don't lose access. |
| `20260709000002_drop_redundant_trip_columns.sql` | Drops the `trips` columns that duplicated the `data` JSONB blob and were never queried directly. |
| `20260709000003_validation_constraints.sql` | Adds size/shape CHECK constraints as a backstop, since clients write to Supabase directly (no API layer validates first). |
| `20260709000004_packing_state_membership_and_index.sql` | Requires actual trip membership (not just row ownership) to read/write `packing_state`; adds a missing index on `trip_members.user_id`. |
| `20260709000005_fix_trip_members_rls_recursion.sql` | Fixes an infinite-recursion bug in trip_members' own SELECT policy, found via live testing after 0001. Not currently hit by the app (nothing does a direct client SELECT on trip_members yet) but was broken SQL. |
| `20260709000006_fix_packing_state_policy_not_applying.sql` | Live re-test after running 0004 showed non-members could still write `packing_state`. Root cause: an older-named policy (`"Users can manage own packing state"`) was never dropped, and Postgres combines multiple permissive policies with OR — the old unrestricted one alone let writes through. Drops all known legacy policy names on `packing_state` and `trips`, then lists the actual resulting policies so the fix is visible immediately. |
| `20260709000007_temp_policy_audit_function.sql` | Temporary — adds `_diag_list_policies()` so every table's RLS policies can be listed via one RPC call, catching the same "orphaned legacy policy" class of bug as 0006 anywhere else it might exist. Run 0008 after the audit to remove it. |
| `20260709000008_drop_policy_audit_function.sql` | Cleanup for 0007 — drops `_diag_list_policies()` once the audit is done. |
