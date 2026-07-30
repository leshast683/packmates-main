-- Optional custom header image for the weekly newsletter. When a queued
-- row sets this (to a real, public https URL — e.g. an image already
-- pushed into the repo's img/ folder), api/send-newsletter.js renders it
-- as a full-width hero banner instead of the default gradient+logo+headline
-- header. Leave it blank/null for a normal week and the default header is
-- used, so this is purely additive — no existing behavior changes.
ALTER TABLE newsletters ADD COLUMN IF NOT EXISTS header_image_url TEXT;
