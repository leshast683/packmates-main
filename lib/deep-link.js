/* App-only: handles Universal Links (e.g. a tapped email-confirmation
   or trip-invite link) while the app is already running/backgrounded.
   Capacitor launches/resumes the app but does not navigate the webview
   on its own - it just fires this event, so we have to do the
   navigation ourselves. No-op on the public website (window.Capacitor
   doesn't exist there). */
(function () {
  if (!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform())) return;
  var App = window.Capacitor.Plugins && window.Capacitor.Plugins.App;
  if (!App || !App.addListener) return;
  App.addListener('appUrlOpen', function (data) {
    try {
      var url = new URL(data.url);
      window.top.location.href = url.pathname + url.search + url.hash;
    } catch (e) {}
  });
})();
