-- "Follow" on a Community Traveler card (discover.html/profile.html) was
-- purely local (localStorage pm_following) - deliberately cosmetic per
-- the surrounding code's own comments, since you can't genuinely
-- "packmate" with someone you've never traveled with. But profile.html's
-- Packmates count/modal folds followed travelers into the same list as
-- real shared-trip packmates, so a person who follows someone on one
-- device/browser and then opens a different device sees a lower count
-- there - the follow never traveled with them either. Adds a real,
-- synced table so a follow (real demo-traveler avatar code, or a real
-- user's UUID) is consistent everywhere the account signs in.
CREATE TABLE IF NOT EXISTS followed_travelers (
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  traveler_key  TEXT NOT NULL,
  followed_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, traveler_key)
);

ALTER TABLE followed_travelers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own followed travelers" ON followed_travelers;
CREATE POLICY "own followed travelers" ON followed_travelers
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
