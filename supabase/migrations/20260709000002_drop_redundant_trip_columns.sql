-- The `trips` table dual-wrote every field in two shapes: individual
-- columns AND the `data` JSONB blob (the app's read path already
-- preferred `data`, falling back to columns only if `data` was null).
-- Nothing queries these columns directly (checked: no .eq()/.select() on
-- destination, dates, travelers, activities, country, image_url, airline,
-- weather_tags, or owner_email anywhere in the client). Drop them —
-- `data` is the single source of truth for trip content going forward.
--
-- Kept: id, user_id (ownership/RLS), invite_code (real lookup key as of
-- the previous migration), created_at (used for ordering), data.

ALTER TABLE trips
  DROP COLUMN IF EXISTS destination,
  DROP COLUMN IF EXISTS from_date,
  DROP COLUMN IF EXISTS to_date,
  DROP COLUMN IF EXISTS travelers,
  DROP COLUMN IF EXISTS activities,
  DROP COLUMN IF EXISTS country,
  DROP COLUMN IF EXISTS image_url,
  DROP COLUMN IF EXISTS airline,
  DROP COLUMN IF EXISTS weather_tags,
  DROP COLUMN IF EXISTS owner_email;

-- destination now only lives in `data` — require it there instead.
ALTER TABLE trips
  DROP CONSTRAINT IF EXISTS trips_data_has_destination;
ALTER TABLE trips
  ADD CONSTRAINT trips_data_has_destination
  CHECK (data IS NOT NULL AND (data->>'destination') IS NOT NULL AND (data->>'destination') <> '');
