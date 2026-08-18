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

  function goTo(url) {
    try {
      var u = new URL(url);
      window.top.location.href = u.pathname + u.search + u.hash;
    } catch (e) {}
  }

  App.addListener('appUrlOpen', function (data) { goTo(data.url); });

  if (App.getLaunchUrl) {
    App.getLaunchUrl().then(function (result) {
      if (result && result.url) goTo(result.url);
    }).catch(function () {});
  }
})();
