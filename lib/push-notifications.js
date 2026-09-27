// Native-app-only: registers this device for real push notifications
// (delivered by Apple's APNs, via Firebase Cloud Messaging, even when the
// app is fully closed - distinct from notifications.html's in-app feed,
// which only shows things while the app is open). No-op on the public
// website - the FirebaseMessaging plugin only exists inside the native
// shell (ios-app/node_modules/@capacitor-firebase/messaging).
(function () {
  const isNative = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  if (!isNative) return;

  const FirebaseMessaging = window.Capacitor.Plugins && window.Capacitor.Plugins.FirebaseMessaging;
  if (!FirebaseMessaging) return; // plugin not installed on this build yet

  function saveToken(tokenValue) {
    if (!tokenValue) return;
    let attempts = 0;
    const trySave = () => {
      if (typeof DB !== 'undefined' && DB.registerDeviceToken) {
        DB.registerDeviceToken(tokenValue, 'ios').catch(() => {});
      } else if (++attempts < 20) {
        /* Auth.js and this script are separate <script> tags on the same
           page - if this fires before auth.js has finished evaluating
           (rare, but not impossible), retry briefly rather than drop the
           token on the floor. */
        setTimeout(trySave, 300);
      }
    };
    trySave();
  }

  async function registerPush() {
    try {
      const perm = await FirebaseMessaging.checkPermissions();
      let status = perm.receive;
      if (status === 'prompt' || status === 'prompt-with-rationale') {
        status = (await FirebaseMessaging.requestPermissions()).receive;
      }
      if (status !== 'granted') return; // person declined - respect it, no retry loop

      const { token } = await FirebaseMessaging.getToken();
      saveToken(token);
    } catch (e) {
      console.error('[Push] registration setup failed:', e);
    }
  }

  /* Fires whenever Firebase issues a new/rotated token, independent of
     the initial getToken() call above. */
  FirebaseMessaging.addListener('tokenReceived', (event) => saveToken(event && event.token));

  /* A push that arrives while the app is already open in the foreground -
     surface it via the existing toast() if the current page happens to
     define one, otherwise let it pass silently (it already reached the
     person if the app was backgrounded/closed, which is the actual point
     of this feature). */
  FirebaseMessaging.addListener('notificationReceived', (event) => {
    try {
      const n = event && event.notification;
      if (typeof toast === 'function' && n && n.title) toast(n.title);
    } catch (e) {}
  });

  /* Tapping a delivered notification (app was backgrounded/closed) -
     route to the dashboard, always a safe landing spot regardless of
     which notification type this was. A future pass could inspect
     event.notification.data to deep-link to the specific trip. */
  FirebaseMessaging.addListener('notificationActionPerformed', () => {
    window.top.location.href = 'index.html';
  });

  registerPush();
})();
