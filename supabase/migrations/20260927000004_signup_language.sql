-- signup.html now asks for a language preference alongside gender, and
-- passes it through auth.signUp()'s options.data (same mechanism already
-- used for name/gender - see auth.js's register()). This updates
-- handle_new_user() to also seed profiles.language from that metadata, so
-- a new account's language choice is saved from the moment it's created
-- instead of only syncing in later via DB.saveProfile()/syncProfile() the
-- first time the person opens Settings. profiles.language itself already
-- exists (20260927000001_add_profile_language.sql).
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  BEGIN
    INSERT INTO public.profiles (id, name, gender, language, notif, discoverable)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'name', ''),
      COALESCE(NEW.raw_user_meta_data->>'gender', NULL),
      COALESCE(NEW.raw_user_meta_data->>'language', NULL),
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
