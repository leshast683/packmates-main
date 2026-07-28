// Native-app-only instant-transition helper for the pre-login flow
// (welcome -> login/signup -> home). Unlike lib/app-shell.js's tab
// system, these pages have no persistent bottom-nav to switch between
// them and are visited in a straight line, not back-and-forth - so
// rather than reuse the tab-shell's model, this just preloads the
// *next* page in that line into a hidden iframe ahead of time, then
// reveals it in place of a real navigation once the user gets there.
//
// index.html requires an active session (Auth.requireAuth), so it can
// only be preloaded from login/signup AFTER a successful sign-in -
// preloading it earlier would just have its own auth guard immediately
// redirect the hidden iframe back to welcome.html, wasting the load.
(function () {
  if (!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform())) return;
  if (window.self !== window.top) return;

  var frames = {};

  function preload(page) {
    if (frames[page]) return frames[page];
    var f = document.createElement('iframe');
    f.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;border:0;display:none;z-index:9998;';
    document.body.appendChild(f);
    f.src = page;
    frames[page] = f;
    return f;
  }

  function reveal(page) {
    var f = frames[page] || preload(page);
    var show = function () {
      Array.prototype.forEach.call(document.body.children, function (el) {
        if (el !== f) el.style.display = 'none';
      });
      f.style.display = 'block';
    };
    // Wait for a genuine load rather than showing immediately - these
    // pages have no early-loading spinner of their own (unlike the
    // tab-shell's pages), so revealing before 'load' would show a
    // blank flash instead of avoiding one.
    var loaded = false;
    try { loaded = f.contentDocument && f.contentDocument.readyState === 'complete' && f.contentWindow.location.href !== 'about:blank'; } catch (e) {}
    if (loaded) show();
    else f.addEventListener('load', show, { once: true });
  }

  window.PmAuthFlow = { preload: preload, reveal: reveal };
})();
