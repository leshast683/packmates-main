-- Weekly newsletter: self-service content queue + one-click unsubscribe.
--
-- Content is authored entirely in Supabase Studio's Table Editor, not in
-- code: insert a row into `newsletters` with status left as 'queued' any
-- time before the weekly cron runs (see vercel.json + api/send-newsletter.js)
-- and it becomes that week's send. No deploy needed to change content.

-- ── Content queue ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS newsletters (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  subject    TEXT NOT NULL,
  headline   TEXT NOT NULL,
  body       TEXT NOT NULL,   -- plain text; blank lines become paragraph breaks
  cta_text   TEXT,
  cta_url    TEXT,
  status     TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','sent')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sent_at    TIMESTAMPTZ
);
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;
-- No policies added on purpose — only the service-role key
-- (api/send-newsletter.js) and the project owner via Supabase Studio
-- (which bypasses RLS) ever need to touch this table; no app client
-- should query it directly.

-- ── Unsubscribe token, one per user, generated automatically ──────────
-- Backs the newsletter footer's one-click unsubscribe link. A random
-- per-user token (not the user id alone) means the link can't be replayed
-- to unsubscribe someone else by guessing/incrementing an id.
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS newsletter_unsub_token UUID DEFAULT gen_random_uuid();
UPDATE profiles SET newsletter_unsub_token = gen_random_uuid() WHERE newsletter_unsub_token IS NULL;

-- ── One-click unsubscribe RPC ──────────────────────────────────────────
-- Verifies the token server-side (SECURITY DEFINER, same trust model as
-- the rest of this file's sibling RPCs) then flips the existing
-- profiles.notif->>'updates' opt-in flag off — the same flag Settings'
-- "Weekly Newsletter" toggle already reads/writes, so unsubscribing via
-- email link and toggling off in-app land on the exact same state.
CREATE OR REPLACE FUNCTION unsubscribe_newsletter(p_user_id UUID, p_token UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  matched BOOLEAN := FALSE;
BEGIN
  UPDATE profiles
     SET notif = COALESCE(notif, '{}'::jsonb) || '{"updates": false}'::jsonb
   WHERE id = p_user_id AND newsletter_unsub_token = p_token
  RETURNING TRUE INTO matched;
  RETURN COALESCE(matched, FALSE);
END;
$$;
