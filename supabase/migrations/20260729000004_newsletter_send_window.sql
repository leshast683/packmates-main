-- Optional send window per newsletter row. When set, api/send-newsletter.js
-- only picks this row if today's date falls within [send_after, send_before]
-- (either bound may be left null to mean "no limit on that side"). A row
-- outside its window is skipped in favor of the next eligible queued row —
-- it stays 'queued' rather than being marked 'sent', so e.g. a
-- summer-themed newsletter queued in July but never actually sent (cron
-- didn't run, no opted-in users yet, etc.) won't suddenly go out looking
-- dated once the season's passed.
ALTER TABLE newsletters ADD COLUMN IF NOT EXISTS send_after  DATE;
ALTER TABLE newsletters ADD COLUMN IF NOT EXISTS send_before DATE;
