-- CRITICAL FIX: trip creation has been silently failing for every new trip.
--
-- newTrip.html's save flow calls DB.saveTrip(), which does
-- client.from('trips').upsert(_tripRow(tripData, uid), { onConflict: 'id' })
-- — Supabase JS's upsert() sends `Prefer: resolution=merge-duplicates`,
-- which PostgREST turns into `INSERT ... ON CONFLICT (id) DO UPDATE ...`.
--
-- Live-tested and isolated (three-way comparison against production):
--   - A plain INSERT of a brand-new trip row: succeeds.
--   - An upsert of an EXISTING trip row (genuine conflict -> update path): succeeds.
--   - An upsert of a BRAND-NEW trip row (no conflict, insert path within
--     an ON CONFLICT DO UPDATE statement): fails with 42501 "new row
--     violates row-level security policy for table trips" — even though
--     the exact same row succeeds via a plain INSERT.
--
-- Root cause, confirmed by comparison with packing_state (which uses the
-- exact same upsert() call pattern from auth.js and works correctly):
-- packing_state has ONE unified `FOR ALL` policy, while trips has
-- SEPARATE `FOR INSERT` and `FOR UPDATE` policies (even though both have
-- the identical condition auth.uid() = user_id). Postgres's row-security
-- handling of INSERT ... ON CONFLICT DO UPDATE does not reliably work
-- with split per-command policies for this case — replicated the same
-- brand-new-row upsert on packing_state successfully (single FOR ALL
-- policy), confirming the split policies on trips are the actual cause.
--
-- Because DB.saveTrip() also never awaits or surfaces this failure (fire
-- and forget .then()), the user sees zero indication anything went
-- wrong — the UI proceeds straight to tripPreview.html, which then reads
-- the trip back out of localStorage (already written synchronously
-- before the failed network call), completely masking the failure in
-- the browser that created the trip. It only becomes visible from a
-- second device, after a cache-clearing sync, or when someone else tries
-- to join via the invite code and finds nothing there.
--
-- Fix: drop the split trips write policies and replace with one unified
-- FOR ALL policy, matching the working packing_state pattern. SELECT
-- ("Trip members can view") and DELETE ("Trip owner can delete") stay as
-- they are — PostgreSQL OR-combines multiple permissive policies per
-- command, so this purely adds coverage for insert/update without
-- narrowing anything.

DO $$ BEGIN
  DROP POLICY IF EXISTS "Trip owner can insert" ON trips;
  DROP POLICY IF EXISTS "Trip owner can update" ON trips;
END $$;

CREATE POLICY "Trip owner can write" ON trips
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
