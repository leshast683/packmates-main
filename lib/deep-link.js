/* App-only: handles Universal Links (e.g. a tapped email-confirmation
   or trip-invite link), for both cases Capacitor distinguishes:
   - warm/backgrounded: the app is already running, fires 'appUrlOpen'.
   - cold launch: the app wasn't running yet, tapping the link is what
     launches it. Capacitor still loads whatever page server.url resolves
     to by default (e.g. welcome.html with no params) rather than
     navigating straight to the tapped URL - App.getLaunchUrl() is the
     dedicated API for finding out a launch was actually a link tap, so
     we can redirect immediately instead of letting that default page's
     own flow (icon carousel, hiding the native splash screen once
     preloaded) run first and visibly flash before the real destination
     takes over.
   No-op on the public website (window.Capacitor doesn't exist there). */
(function () {
  if (!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform())) return;
  var App = window.Capacitor.Plugins && window.Capacitor.Plugins.App;
  if (!App || !App.addListener) return;

  /* getLaunchUrl() reports what launched the app *process* - it isn't a
     one-time "consume and forget" event, and can keep resolving with the
     same URL on subsequent calls after an in-webview navigation (as
     opposed to a full native relaunch). After the OAuth relay (see
     welcome.html's native-OAuth comment) navigates here via
     window.top.location.href, this same script tag runs again on the
     freshly-loaded page, getLaunchUrl() resolves with that same original
     packmatesai:// URL again, and goTo() redirects again - forever,
     reloading the whole page each time (the visible icon-flash/glitch
     loop). sessionStorage persists across same-origin navigations within
     this run, so dedupe identical URLs handled within the last few
     seconds - long enough to absorb the reload loop's near-instant
     repeats, short enough that a genuine, deliberate re-tap of the same
     link minutes later (e.g. the same email link opened twice) still
     works normally instead of being silently swallowed. */
  var _HANDLED_KEY = 'pm_deeplink_last_handled';
  var _DEDUPE_MS = 4000;
  function recentlyHandled(url) {
    try {
      var raw = sessionStorage.getItem(_HANDLED_KEY);
      if (!raw) return false;
      var rec = JSON.parse(raw);
      return rec.url === url && (Date.now() - rec.at) < _DEDUPE_MS;
    } catch (e) { return false; }
  }
  function markHandled(url) {
    try { sessionStorage.setItem(_HANDLED_KEY, JSON.stringify({ url: url, at: Date.now() })); } catch (e) {}
  }

  function goTo(url) {
    if (recentlyHandled(url)) return;
    markHandled(url);
    try {
      /* Custom-scheme relay from welcome.html's native-OAuth hand-off (see
         its own comment) - handled explicitly rather than via the generic
         new URL(...) parsing below, since WHATWG URL parsing of a
         non-http custom scheme like packmatesai://auth-callback?code=X
         doesn't split into pathname/search the way a real URL does. */
      var relayPrefix = 'packmatesai://auth-callback';
      if (url.indexOf(relayPrefix) === 0) {
        window.top.location.href = '/welcome.html' + url.slice(relayPrefix.length);
      } else {
        var u = new URL(url);
        window.top.location.href = u.pathname + u.search + u.hash;
      }
    } catch (e) {}
    /* Defensive: iOS normally dismisses the in-app OAuth browser sheet
       (@capacitor/browser, used for Google/Apple sign-in) on its own when
       handing a Universal Link back to the app, but close it explicitly
       too in case that handoff ever leaves it lingering on-screen. */
    var Browser = window.Capacitor.Plugins && window.Capacitor.Plugins.Browser;
    if (Browser && Browser.close) Browser.close().catch(function () {});
  }

  App.addListener('appUrlOpen', function (data) { goTo(data.url); });

  if (App.getLaunchUrl) {
    App.getLaunchUrl().then(function (result) {
      if (result && result.url) goTo(result.url);
    }).catch(function () {});
  }
})();
