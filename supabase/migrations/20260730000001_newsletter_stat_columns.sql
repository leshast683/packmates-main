-- Generalizes the "stat callout box" (originally hardcoded 40°F/20°F for
-- the cold-weather newsletter only) into per-row optional fields, so any
-- checklist-layout newsletter can opt into one. Left blank, a row simply
-- doesn't get a stat box — except the already-queued cold-weather row,
-- which api/send-newsletter.js falls back to rendering with its original
-- hardcoded copy when these are unset, so that row's approved appearance
-- doesn't change.
ALTER TABLE newsletters ADD COLUMN IF NOT EXISTS stat_caption TEXT;
ALTER TABLE newsletters ADD COLUMN IF NOT EXISTS stat_left    TEXT;
ALTER TABLE newsletters ADD COLUMN IF NOT EXISTS stat_right   TEXT;
ALTER TABLE newsletters ADD COLUMN IF NOT EXISTS stat_footer  TEXT;
