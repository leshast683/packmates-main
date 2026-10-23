-- registerDeviceToken() (auth.js) upserts with onConflict:'token', but
-- device_tokens only ever had a composite UNIQUE(user_id, token) - not a
-- standalone constraint on token alone. Supabase/PostgREST requires the
-- onConflict target to exactly match an existing unique/exclusion
-- constraint, so every single upsert has failed (42P10: no matching
-- constraint) since this table was created - caught, logged to the
-- console, and silently returned {success:false}. No device has ever
-- actually registered a push token, for any user.
--
-- The composite constraint was also the wrong shape anyway -
-- registerDeviceToken()'s own comment describes wanting a token to
-- belong to exactly one user at a time (so a device reset/resold and
-- signed into by someone new reassigns the existing row instead of
-- erroring or duplicating), which only a token-alone uniqueness
-- constraint actually enforces.
ALTER TABLE device_tokens DROP CONSTRAINT IF EXISTS device_tokens_user_id_token_key;
ALTER TABLE device_tokens ADD CONSTRAINT device_tokens_token_key UNIQUE (token);
