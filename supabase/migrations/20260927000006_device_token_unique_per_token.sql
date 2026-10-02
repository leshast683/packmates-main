-- device_tokens previously allowed the same FCM token to be registered
-- under more than one user_id (UNIQUE was (user_id, token), not token
-- alone) - a stolen/leaked device token could be re-registered to a
-- different user_id, causing that attacker's push content to be
-- delivered to the original owner's physical device. No data would
-- leak (Firebase delivers to the token regardless of whose row
-- triggered it), but it's cheap, correct defense-in-depth to make a
-- token belong to exactly one user at a time - matching how a real
-- device's push token should behave.
--
-- Dropping the compound constraint rather than keeping both: once
-- `token` alone is unique, (user_id, token) is redundant. auth.js's
-- registerDeviceToken() upsert is updated alongside this (onConflict:
-- 'token' instead of 'user_id,token') so re-registering an existing
-- token - the legitimate case of a device being reset/resold and signed
-- into by a new person, not just the attack this closes - reassigns
-- that row to the new owner instead of erroring out.
ALTER TABLE device_tokens DROP CONSTRAINT IF EXISTS device_tokens_user_id_token_key;
ALTER TABLE device_tokens ADD CONSTRAINT device_tokens_token_key UNIQUE (token);
