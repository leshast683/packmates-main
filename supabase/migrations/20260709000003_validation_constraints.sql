-- Clients write to these tables directly via the Supabase JS SDK (anon
-- key + RLS) — there's no API layer in front of them to validate shape or
-- size before a write lands. RLS only checks *who* owns a row, not
-- *what's* in it. These CHECK constraints are a lightweight backstop
-- against a buggy client bloating a row or writing malformed JSON, not a
-- replacement for real input validation.

-- ── trips.data: cap size (trips_data_has_destination already added in
--    the previous migration) ─────────────────────────────────────────
ALTER TABLE trips
  DROP CONSTRAINT IF EXISTS trips_data_size;
ALTER TABLE trips
  ADD CONSTRAINT trips_data_size
  CHECK (octet_length(data::text) < 100000); -- 100KB

-- ── packing_state: cap each JSONB field ─────────────────────────────
ALTER TABLE packing_state
  DROP CONSTRAINT IF EXISTS packing_state_item_state_size;
ALTER TABLE packing_state
  ADD CONSTRAINT packing_state_item_state_size
  CHECK (octet_length(item_state::text) < 100000);

ALTER TABLE packing_state
  DROP CONSTRAINT IF EXISTS packing_state_custom_items_size;
ALTER TABLE packing_state
  ADD CONSTRAINT packing_state_custom_items_size
  CHECK (octet_length(custom_items::text) < 50000);

ALTER TABLE packing_state
  DROP CONSTRAINT IF EXISTS packing_state_dismissed_size;
ALTER TABLE packing_state
  ADD CONSTRAINT packing_state_dismissed_size
  CHECK (octet_length(dismissed::text) < 20000);

-- ── error_logs: DB-level backstop behind api/log-error.js's own
--    request-body size cap and per-field strip(str, MAX_FIELD_LEN) ───
ALTER TABLE error_logs
  DROP CONSTRAINT IF EXISTS error_logs_field_sizes;
ALTER TABLE error_logs
  ADD CONSTRAINT error_logs_field_sizes
  CHECK (
    length(message) < 2000 AND
    length(stack)   < 2000 AND
    octet_length(context::text) < 10000
  );

-- ── profiles: notif/privacy are small fixed-shape preference blobs ──
ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS profiles_notif_size;
ALTER TABLE profiles
  ADD CONSTRAINT profiles_notif_size
  CHECK (octet_length(notif::text) < 5000);

ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS profiles_privacy_size;
ALTER TABLE profiles
  ADD CONSTRAINT profiles_privacy_size
  CHECK (octet_length(privacy::text) < 5000);
