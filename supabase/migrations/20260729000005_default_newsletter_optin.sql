-- New accounts should start opted in to the weekly newsletter (Settings'
-- "Weekly Newsletter" toggle, backed by profiles.notif->>'updates').
-- Existing users are untouched — this only changes what a brand-new
-- profiles row gets on signup, via the same handle_new_user() trigger
-- that already runs on every new auth.users insert.
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  BEGIN
    INSERT INTO public.profiles (id, name, gender, notif)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'name', ''),
      COALESCE(NEW.raw_user_meta_data->>'gender', NULL),
      '{"updates": true}'::jsonb
    )
    ON CONFLICT (id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    -- Swallow errors so signup always succeeds
    NULL;
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
