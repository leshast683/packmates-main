-- Adds profiles.language — the app's language preference (set from the
-- Settings > Language picker, lib/i18n.js's setLang()) was local-only in
-- localStorage's pm_profile.language, so switching languages on one device
-- never carried over to another signed-in device (web, mobile web, or the
-- native app). auth.js's DB.saveProfile()/syncProfile() already send and
-- read this field defensively (retrying/falling back if the column is
-- missing), so this migration alone is enough to turn sync on — no client
-- deploy required alongside it, though one already shipped ahead of this
-- migration since the fallback made it safe to.
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS language TEXT;
