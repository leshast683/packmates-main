-- welcomeTour.html (the 5-slide post-signup welcome carousel) should
-- show exactly once per account, never again on any device - not just
-- once per browser. auth.js's DB.saveProfile()/syncProfile() already
-- sync this column the same way as language/temp_unit (fire-and-forget
-- write when the tour finishes, read back into pm_profile.tourSeen on
-- sign-in), with a graceful fallback if this migration hasn't run yet.
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tour_seen BOOLEAN NOT NULL DEFAULT false;
