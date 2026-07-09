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
