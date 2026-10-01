-- Adds profiles.temp_unit - the app's temperature display unit ('F' or
-- 'C'), set from Settings > Temperature Unit (lib/i18n.js's
-- setTempUnit()). Same sync pattern as profiles.language
-- (20260927000001_add_profile_language.sql): auth.js's
-- DB.saveProfile()/syncProfile() already send and read this field
-- defensively (retrying/falling back if the column is missing), so this
-- migration alone is enough to turn sync on across devices.
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS temp_unit TEXT;
