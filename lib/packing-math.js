/**
 * Packing percentage math — shared by index.js, profile.html, packing-list.js,
 * and tripPreview.html (previously duplicated 4x with identical logic).
 * Works both as a browser script (attaches window.PackingMath) and as a
 * CommonJS module (for tests / Node tooling).
 */
function calcPackedPct(packed, total) {
  return total > 0 ? Math.round((packed / total) * 100) : 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calcPackedPct };
}
if (typeof window !== 'undefined') {
  window.PackingMath = { calcPackedPct };
}
