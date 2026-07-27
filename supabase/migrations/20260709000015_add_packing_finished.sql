-- Adds packing_state.finished — the "Finish Packing" toggle (added
-- client-side to packing-list.html this session) was only ever persisted
-- to localStorage. DB.savePackState() silently dropped it since it wasn't
-- one of the upserted columns, so it never reached Supabase and could
-- never be restored on a different device.
ALTER TABLE packing_state ADD COLUMN IF NOT EXISTS finished BOOLEAN DEFAULT FALSE;
