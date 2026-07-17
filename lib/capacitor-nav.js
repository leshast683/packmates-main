// Native-app-only bottom nav tweak: raises "New Trip" into a bigger, centered
// button. Runs only inside the Capacitor iOS shell (window.Capacitor present
// and isNativePlatform() true) — the public website's nav is untouched.
(function () {
  if (!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform())) return;

  var nav = document.querySelector('.bottom-nav');
  if (!nav) return;

  var newTripBtn = nav.querySelector("button[onclick*=\"newTrip.html\"]");
  var packingBtn = nav.querySelector("button[onclick*=\"packing-list.html\"]");
  if (!newTripBtn || !packingBtn) return;

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
  if (window.Capacitor.Plugins && window.Capacitor.Plugins.StatusBar) {
    var topColor = sampleTopBackground();
    var isLight = topColor && relativeLuminance(topColor) > 0.5;
    // Capacitor's Style enum names the icon color, not the background it's
    // for: Style.Light ("LIGHT") = dark icons, Style.Dark ("DARK") = light
    // icons. A light page needs dark icons, so isLight maps to 'LIGHT'.
    window.Capacitor.Plugins.StatusBar.setStyle({ style: isLight ? 'LIGHT' : 'DARK' });
  }

  function sampleTopBackground() {
    var x = Math.floor((window.innerWidth || document.documentElement.clientWidth) / 2);
    var el = document.elementFromPoint(x, 1);
    while (el) {
      var m = getComputedStyle(el).backgroundColor.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
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
})();
