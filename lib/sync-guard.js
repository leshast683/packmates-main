/**
 * Grace-window guard used by auth.js's DB.syncTrips()/syncPackState() to
 * avoid a pull-based sync clobbering a local write that hasn't been
 * confirmed by the server yet. See auth.js for the full rationale.
 * Works both as a browser script (attaches window.SyncGuard) and as a
 * CommonJS module (for tests / Node tooling).
 */
function createGraceGuard(graceMs) {
  let until = 0;
  return {
    markDirty() { until = Date.now() + graceMs; },
    clear() { until = 0; },
    isDirty() { return Date.now() < until; },
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createGraceGuard };
}
if (typeof window !== 'undefined') {
  window.SyncGuard = { createGraceGuard };
}
