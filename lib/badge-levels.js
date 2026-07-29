// Shared badge-level thresholds - single source of truth for profile.html's
// level bar display and packing-list.js's level-up notification, so the
// two can never drift the way the old per-page duplicated logic could.
(function () {
  const BADGE_TIERS = [
    { name:'Beginner',      min:0 },
    { name:'Adventurer',    min:100 },
    { name:'Wanderer',      min:250 },
    { name:'Explorer',      min:500 },
    { name:'Globetrotter',  min:1000 },
    { name:'World Citizen', min:2000 },
  ];

  function getBadgeTier(totalItemsPacked) {
    const revIdx = [...BADGE_TIERS].reverse().findIndex(t => totalItemsPacked >= t.min);
    return BADGE_TIERS[BADGE_TIERS.length - 1 - revIdx];
  }

  // Lifetime items packed across every trip - counts each item once per
  // trip the moment it's checked off, same as the "X of Y items packed"
  // count shown elsewhere (not quantity-weighted).
  function getTotalItemsPacked() {
    const trips = [];
    try { trips.push(...JSON.parse(localStorage.getItem('pm_trips') || '[]')); } catch (e) {}
    try {
      const cur = JSON.parse(localStorage.getItem('currentTrip') || 'null');
      if (cur?.id && !trips.find(t => t.id === cur.id)) trips.push(cur);
    } catch (e) {}
    let total = 0;
    trips.forEach(t => {
      try {
        const pd = JSON.parse(localStorage.getItem(`pm_pack_${t.id}`) || '{}');
        total += Object.values(pd.itemState || {}).filter(v => v?.packed).length;
      } catch (e) {}
    });
    return total;
  }

  // Call after any change that could move the total items-packed count.
  // Fires a "Congratulations" notification the moment the user's tier
  // actually advances - never on the very first call for a given browser
  // (that would just be "discovering" whatever tier existing packing
  // history already put them in, not a real achievement happening now).
  function checkBadgeLevelUp() {
    const tier = getBadgeTier(getTotalItemsPacked());
    let lastTier = null;
    try { lastTier = localStorage.getItem('pm_last_badge_tier'); } catch (e) {}
    if (lastTier !== tier.name) {
      const isFirstRun = lastTier === null;
      try { localStorage.setItem('pm_last_badge_tier', tier.name); } catch (e) {}
      if (!isFirstRun && window.Notify) {
        const msg = `Congratulations! Welcome to ${tier.name}.`;
        if (Notify.push('achievement', msg, null, 'badge_' + tier.name)) {
          Notify.showToast(msg, 'achievement', '');
        }
      }
    }
    return tier;
  }

  window.BadgeLevels = { BADGE_TIERS, getBadgeTier, getTotalItemsPacked, checkBadgeLevelUp };
})();
