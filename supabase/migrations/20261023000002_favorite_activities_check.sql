-- Security fix: profiles.favorite_activities was added as a bare
-- TEXT[] with no constraint. The UI only ever sends one of the 15
-- fixed categories (welcomeTour.html's ACTIVITIES list), but nothing
-- stopped a user from writing arbitrary strings directly via
-- DB.saveProfile() / a raw PATCH to their own row - which other users
-- could then see rendered on the attacker's Community Traveler card
-- (get_discoverable_travelers() exposes this column to any other
-- authenticated user for discoverable profiles). Defense in depth
-- alongside the render-side escaping fix in discover.html/profile.html -
-- this closes it off at the data layer too, so only the intended
-- enum can ever be persisted.
ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS profiles_favorite_activities_check;
ALTER TABLE profiles
  ADD CONSTRAINT profiles_favorite_activities_check
  CHECK (favorite_activities <@ ARRAY[
    'Beach','Hiking','Camping','Swimming','Snow Sports','Gym','Business Trip',
    'Night Out','Baby','Theme Park','Festival','Road Trip','City Sightseeing',
    'Dining','Cruise'
  ]::text[]);
