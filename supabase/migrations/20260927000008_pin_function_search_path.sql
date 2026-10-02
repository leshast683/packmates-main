-- Every SECURITY DEFINER function in this project ran without SET
-- search_path pinned - Supabase's own database linter flags this as
-- "function_search_path_mutable". A SECURITY DEFINER function executes
-- with its owner's privileges but, without a fixed search_path, resolves
-- unqualified table/function references using the CALLER's search_path -
-- a role with schema-creation rights could in principle shadow an
-- unqualified reference inside one of these. Supabase's hosted default
-- `authenticated`/`anon` roles don't have CREATE on public, so this
-- isn't practically exploitable here, but it's a one-line fix per
-- function and matches Postgres's own documented hardening guidance for
-- SECURITY DEFINER functions.
--
-- ALTER FUNCTION, not CREATE OR REPLACE - this only sets the search_path
-- config parameter on the existing function, without needing to
-- reproduce (and risk transcribing) each function's actual body.
ALTER FUNCTION handle_new_trip() SET search_path = public;
ALTER FUNCTION handle_new_user() SET search_path = public;
ALTER FUNCTION is_trip_member(TEXT) SET search_path = public;
ALTER FUNCTION join_trip_by_code(TEXT) SET search_path = public;
ALTER FUNCTION preview_trip_by_code(TEXT) SET search_path = public;
ALTER FUNCTION user_trip_ids() SET search_path = public;
ALTER FUNCTION get_discoverable_travelers(INT) SET search_path = public;
ALTER FUNCTION get_my_packmates() SET search_path = public;
ALTER FUNCTION get_trip_member_profiles(TEXT) SET search_path = public;
ALTER FUNCTION add_packmate_to_trip(TEXT, UUID) SET search_path = public;
ALTER FUNCTION remove_trip_member(TEXT, UUID) SET search_path = public;
ALTER FUNCTION unsubscribe_newsletter(UUID, UUID) SET search_path = public;
