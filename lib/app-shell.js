// Native-app-only tab shell. Every bottom-nav tap used to be a full page
// reload (location.href), which on this multi-page site meant tearing down
// the whole document and re-running the new page's JS/data fetches every
// single time — the source of the blank/white flash between tabs that no
// amount of prefetching or spinner-tuning could fully hide, since the cost
// is JS execution + Supabase queries, not network fetch.
//
// This loads each *other* tab's page into its own persistent background
// <iframe> exactly once — completely unmodified, same as a real navigation
// — and keeps it alive for the rest of the session. Switching tabs just
// toggles which one is visible: instant, because nothing ever reloads.
//
// Deliberately does NOT intercept anything except the 5 bottom-nav buttons
// themselves — in-page links (e.g. Packing's "Back to Trip", Discover's
// destination cards) still do a real navigation *inside whichever tab's
// iframe they were tapped in*; see the drift-detection block below for how
// that's kept from corrupting the tab cache.
(function () {
  if (!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform())) return;
  // Only the real top-level page runs the shell. When app-shell.js loads as
  // part of one of THIS SAME script's own background iframes (each of the 5
  // tab pages includes it), window.self !== window.top there, so it's
  // inert — no nested shell-within-a-shell.
  if (window.self !== window.top) return;

  var TAB_PAGES = ['index.html', 'discover.html', 'packing-list.html', 'newTrip.html', 'profile.html', 'notifications.html'];

  var main = document.querySelector('body > main') || document.querySelector('main');
  var nav = document.querySelector('.bottom-nav');
  if (!main || !nav) return; // don't half-build a shell on an unexpected page shape

  var hostPage = (location.pathname.split('/').pop() || 'index.html');
  if (TAB_PAGES.indexOf(hostPage) === -1) return;

  var tabHost = document.createElement('div');
  tabHost.id = 'pmTabHost';
  // pointer-events:none here is required, not optional: this container
  // sits fixed over the full viewport (so it's ready to show a tab's
  // iframe at any time), including whenever the host page's own <main> is
  // what's actually visible underneath it. Without this, the container —
  // transparent or not — intercepts every touch, breaking scroll/swipe on
  // the host page entirely. Each iframe opts back into receiving touch
  // individually (see ensureFrame) once it's the one actually showing.
  tabHost.style.cssText = 'position:fixed;inset:0;z-index:10;pointer-events:none;';
  main.insertAdjacentElement('afterend', tabHost);

  var frames = {};       // pageName -> iframe element, only for non-host tabs
  var visibleKey = hostPage;

  function setActiveNav(pageName) {
    var btns = nav.querySelectorAll('.bn-btn[data-tab]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.toggle('active', btns[i].dataset.tab === pageName);
    }
  }

  function sampleAndSetStatusBar(doc) {
    if (!(window.Capacitor.Plugins && window.Capacitor.Plugins.StatusBar && window.PmNavUtils)) return;
    var color = window.PmNavUtils.sampleTopBackground(doc);
    var isLight = color && window.PmNavUtils.relativeLuminance(color) > 0.5;
    window.Capacitor.Plugins.StatusBar.setStyle({ style: isLight ? 'LIGHT' : 'DARK' });
  }

  function onFrameLoaded(frame, pageName) {
    // Appending an iframe before its src starts loading can fire a
    // spurious 'load' for the initial empty about:blank document, ahead
    // of the real navigation. Without this guard that was read as "this
    // frame drifted to the wrong page" (about:blank !== pageName) and
    // evicted the iframe from the cache immediately after creating it —
    // so every subsequent tap of that tab rebuilt it from scratch,
    // forever, since nothing ever re-added it once evicted. A real,
    // finished navigation never has an about:blank href.
    var href = null;
    try { href = frame.contentWindow.location.href; } catch (e) { /* cross-origin, shouldn't happen same-origin */ }
    if (!href || href === 'about:blank') return;

    var cd = frame.contentDocument;
    var actual = (frame.contentWindow.location.pathname.split('/').pop() || 'index.html');

    // Drift: the user followed an un-intercepted in-page link inside this
    // tab's iframe (e.g. Packing -> "Back to Trip" -> tripPreview.html), so
    // this iframe no longer represents the tab it was created for. Evict it
    // so the next tap of that tab rebuilds a fresh copy instead of silently
    // showing stale/wrong content.
    if (actual !== pageName) {
      delete frames[pageName];
      if (visibleKey === pageName) {
        // This drifted tab was the one on screen. Without resetting
        // visibleKey here, switchTab's own `if (pageName === visibleKey)
        // return` guard would treat a later tap of this same tab as a
        // no-op forever (visibleKey still points at a tab whose iframe
        // no longer exists), which reads as "the nav stopped responding" -
        // hide the now-stale frame and clear visibleKey so the next tap
        // of any tab, including this one, runs switchTab's full logic.
        frame.style.display = 'none';
        visibleKey = null;
        setActiveNav(null);
      }
      frame.remove();
      return;
    }

    if (visibleKey === pageName) sampleAndSetStatusBar(cd);
  }

  function ensureFrame(pageName) {
    if (frames[pageName]) return frames[pageName];
    var f = document.createElement('iframe');
    f.dataset.tabKey = pageName;
    f.allow = 'autoplay';
    f.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;display:none;pointer-events:auto;';
    f.addEventListener('load', function () { onFrameLoaded(f, pageName); });
    tabHost.appendChild(f);
    f.src = pageName; // set after listeners are attached so 'load' can't fire first
    frames[pageName] = f;
    return f;
  }

  function switchTab(pageName) {
    if (pageName === visibleKey) return;
    if (TAB_PAGES.indexOf(pageName) === -1) return;

    if (visibleKey === hostPage) {
      main.style.display = 'none';
    } else if (frames[visibleKey]) {
      frames[visibleKey].style.display = 'none';
    }

    if (pageName === hostPage) {
      main.style.display = '';
      sampleAndSetStatusBar(document);
    } else {
      var f = ensureFrame(pageName);
      f.style.display = 'block'; // reveal immediately — its own pmLoadSpin covers a first-ever load
      if (f.contentDocument && f.contentDocument.readyState === 'complete' && f.dataset.tabKey === pageName) {
        sampleAndSetStatusBar(f.contentDocument); // already preloaded — sample now, no load event coming
      }
      // else: onFrameLoaded's 'load' listener will sample once this first load finishes
    }

    visibleKey = pageName;
    setActiveNav(pageName);
  }

  // Belt-and-suspenders: null out each button's own onclick directly,
  // rather than relying solely on stopPropagation() below to keep it from
  // firing. Only done once the shell has successfully reached this point
  // (main/nav found, host page recognized), so a shell that fails to
  // initialize for any reason leaves the original location.href behavior
  // fully intact as a fallback instead of silently breaking navigation.
  var navBtns = nav.querySelectorAll('.bn-btn[data-tab]');
  for (var bi = 0; bi < navBtns.length; bi++) navBtns[bi].onclick = null;

  nav.addEventListener('click', function (e) {
    var btn = e.target.closest('.bn-btn[data-tab]');
    if (!btn) return;
    e.stopPropagation();
    e.preventDefault();
    switchTab(btn.dataset.tab);
  }, true);

  // Preload the other tabs once this page is idle, same timing the old
  // per-page <link rel=prefetch> hinting used — but building real iframes
  // now, so tabs are typically already loaded before they're ever tapped.
  var preload = function () {
    TAB_PAGES.forEach(function (page) {
      if (page !== hostPage) ensureFrame(page);
    });
  };
  if ('requestIdleCallback' in window) requestIdleCallback(preload, { timeout: 2000 });
  else setTimeout(preload, 300);

  // Public API so links outside the bottom-nav (e.g. Home's header avatar/
  // notification-bell buttons, which aren't .bn-btn[data-tab] elements) can
  // still route through the shell instead of falling back to a real
  // location.href navigation that would tear the whole shell down. Callers
  // must go through window.top.PmAppShell — this is only ever defined on
  // the actual host document, never on an embedded tab's own window.
  window.PmAppShell = { switchTab: switchTab };
})();
