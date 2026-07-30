-- Adds profiles.welcome_email_sent — gates api/send-welcome-email.js so the
-- one-time "welcome" email (sent the first time a confirmed user lands back
-- on welcome.html) can never be double-sent by a retry or a race between
-- multiple tabs/frames hitting the endpoint around the same moment. The
-- endpoint claims the send with a conditional
-- `PATCH ... ?welcome_email_sent=eq.false`, so this column is the single
-- source of truth for "has this user already gotten it."
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS welcome_email_sent BOOLEAN DEFAULT FALSE;
