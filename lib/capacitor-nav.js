// Native-app-only bottom nav tweak: raises "New Trip" into a bigger, centered
// button. Runs only inside the Capacitor iOS shell (window.Capacitor present
// and isNativePlatform() true) — the public website's nav is untouched.
(function () {
  // This exact page can load two ways now: as the real top-level document,
  // or inside one of lib/app-shell.js's persistent background tab iframes
  // (loading itself, unmodified). Checked *before* the native-platform
  // check below, deliberately: Capacitor's native bridge injecting
  // window.Capacitor into iframes (not just the main frame) isn't
  // guaranteed, and if it doesn't, checking isNativePlatform() first would
  // return early here without ever hiding this copy's own bottom nav —
  // leaving it double-rendered under the shell's one persistent nav bar.
  // The site's CSP only allows same-origin framing (frame-ancestors
  // 'self'), and nothing on this site creates iframes of these pages
  // except our own shell, so window.self !== window.top is on its own a
  // safe, sufficient signal that this copy should stay invisible — no
  // second bottom nav, no FAB/status-bar work (the shell owns that now).
  // lib/auth-flow.js's iframe (welcome/login/signup -> home) marks its src
  // with #pmAuthFlow: it's embedded too, but as a final destination with no
  // parent shell providing a nav bar, so it must NOT be treated the same as
  // an app-shell tab — this copy's own bottom-nav is the only one it'll ever
  // get.
  if (window.self !== window.top && location.hash !== '#pmAuthFlow') {
    var embeddedNav = document.querySelector('.bottom-nav');
    if (embeddedNav) embeddedNav.style.display = 'none';
    return;
  }

  // #pmAuthFlow can only ever have been set by lib/auth-flow.js's own
  // preload(), which itself only runs after confirming isNativePlatform()
  // on window.top - so its mere presence here is already proof we're in
  // the native app, regardless of whether *this* iframe's own Capacitor
  // bridge is fully populated (bridge injection into a nested iframe has
  // proven less reliable here than into window.top itself).
  var _isNative = (window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) || location.hash === '#pmAuthFlow';
  if (!_isNative) return;

  // Second-chance removal of index.html's Quick Actions card. index.js
  // only ever inserts this card inside its own setTimeout(...,400)
  // callback, which fires well after this script's synchronous checks
  // run here - a plain one-shot removal always loses that race and
  // never actually catches anything late. A MutationObserver on the
  // card's parent instead removes it the instant it's ever inserted,
  // regardless of how long Capacitor's bridge takes to attach.
  var _quickActions = document.getElementById('quickActionsCard');
  if (_quickActions) _quickActions.remove();
  var _bentoGrid = document.getElementById('bentoGrid');
  if (_bentoGrid) {
    new MutationObserver(function () {
      var qa = document.getElementById('quickActionsCard');
      if (qa) qa.remove();
    }).observe(_bentoGrid, { childList: true });
  }

  // sampleTopBackground/relativeLuminance are used below for this page's own
  // status-bar color, and exposed on window.PmNavUtils so lib/app-shell.js
  // can re-run the same sampling against a different tab's document once
  // that tab becomes the visible one (its own status-bar color may differ
  // from this page's).
  function sampleTopBackground(doc) {
    doc = doc || document;
    var win = doc.defaultView || window;
    var x = Math.floor((win.innerWidth || doc.documentElement.clientWidth) / 2);
    var el = doc.elementFromPoint(x, 1);
    while (el) {
      var m = win.getComputedStyle(el).backgroundColor.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
      if (m && (m[4] === undefined || parseFloat(m[4]) > 0.5)) {
        return [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3])];
      }
      el = el.parentElement;
    }
    return null;
  }

  function relativeLuminance(rgb) {
    var srgb = rgb.map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
  }

  window.PmNavUtils = { sampleTopBackground: sampleTopBackground, relativeLuminance: relativeLuminance };

  var nav = document.querySelector('.bottom-nav');
  if (!nav) return;

  var newTripBtn = nav.querySelector("button[onclick*=\"newTrip.html\"]");
  var packingBtn = nav.querySelector("button[onclick*=\"packing-list.html\"]");
  if (!newTripBtn || !packingBtn) return;

  var packingSvg = packingBtn.querySelector('svg');
  if (packingSvg) {
    packingSvg.outerHTML = '<svg viewBox="0 0 24 24"><rect x="2.9" y="7.19" width="18.2" height="16.51" rx="5.6"/><path d="M9.14 7.19V4.98a2.86 2.86 0 015.72 0v2.21"/><path d="M7.19 7.19h9.62v2.99l-2.47 2.47h-4.68l-2.47-2.47z"/><path d="M6.54 21.1V17.85a1.95 1.95 0 011.95-1.95H15.51a1.95 1.95 0 011.95 1.95V21.1"/></svg>';
  }

  newTripBtn.classList.add('bn-fab');

  var svg = newTripBtn.querySelector('svg');
  if (svg && !svg.parentElement.classList.contains('bn-fab-circle')) {
    var circle = document.createElement('span');
    circle.className = 'bn-fab-circle';
    svg.parentNode.insertBefore(circle, svg);
    circle.appendChild(svg);
  }

  nav.insertBefore(newTripBtn, packingBtn);

  // The status bar overlays the webview (see capacitor.config.json), so its
  // "background" is just whatever's actually rendered behind it. index.html
  // in particular serves both a light dashboard (logged in) and a dark
  // marketing landing page (logged out) from the same file/nav markup, so we
  // can't infer the right icon color from the page alone — sample the real
  // rendered color at the top of the screen instead.
  if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.StatusBar) {
    var topColor = sampleTopBackground();
    var isLight = topColor && relativeLuminance(topColor) > 0.5;
    // Capacitor's Style enum names the icon color, not the background it's
    // for: Style.Light ("LIGHT") = dark icons, Style.Dark ("DARK") = light
    // icons. A light page needs dark icons, so isLight maps to 'LIGHT'.
    window.Capacitor.Plugins.StatusBar.setStyle({ style: isLight ? 'LIGHT' : 'DARK' });
  }

  // This page is showing correctly right now because of the #pmAuthFlow
  // marker, but lib/app-shell.js is deliberately still inert here (it only
  // ever runs on a genuine window.self===window.top host, not recursively
  // inside an already-embedded one) — so nothing intercepts these buttons'
  // own onclick="location.href=...". Left alone, that would navigate only
  // *this* iframe to a page with no #pmAuthFlow marker of its own, and the
  // embedded-check above would correctly (from its own narrow view) hide
  // that page's nav again — which is exactly the bug this fixes. Route
  // every subsequent bottom-nav tap through a real window.top navigation
  // instead, breaking out of the auth-flow iframe entirely: the next page
  // loads as a genuine top-level document, where the shell/nav both behave
  // completely normally from then on.
  if (location.hash === '#pmAuthFlow') {
    var authNavBtns = nav.querySelectorAll('.bn-btn[data-tab]');
    authNavBtns.forEach(function (btn) { btn.onclick = null; });
    nav.addEventListener('click', function (e) {
      var btn = e.target.closest('.bn-btn[data-tab]');
      if (!btn) return;
      e.stopPropagation();
      e.preventDefault();
      window.top.location.href = btn.dataset.tab;
    }, true);
  }
})();
