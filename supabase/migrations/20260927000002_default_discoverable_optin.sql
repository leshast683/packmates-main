-- New accounts should start opted in to Community Travelers (Settings'
-- "Show me in Community Travelers" toggle, backed by profiles.discoverable).
-- This column defaulted to FALSE (see 20260709000010_social_features.sql -
-- a deliberate opt-in-only default at the time), but new users should now
-- start visible instead. Existing users are untouched - this only changes
-- what a brand-new profiles row gets on signup, via the same
-- handle_new_user() trigger that already runs on every new auth.users
-- insert (same pattern as 20260729000005_default_newsletter_optin.sql).
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  BEGIN
    INSERT INTO public.profiles (id, name, gender, notif, discoverable)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'name', ''),
      COALESCE(NEW.raw_user_meta_data->>'gender', NULL),
      '{"updates": true}'::jsonb,
      TRUE
    )
    ON CONFLICT (id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    -- Swallow errors so signup always succeeds
    NULL;
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
