/**
 * lib/cookie-consent.js — cookie consent banner + Google Consent Mode v2
 * wiring + marketing-attribution capture.
 *
 * Consent is read from/written to pm_profile.privacy - the SAME object
 * profile.html's Settings > Privacy panel already uses (privacy.analytics,
 * privacy.personalise). Not a separate consent flag: one source of truth,
 * kept in sync with Settings for logged-in users via DB.saveProfile()
 * where that's loaded, exactly like every other privacy toggle already
 * works. "Marketing" in this banner maps to the existing "personalise"
 * category (closest fit - ad personalization/marketing cookies) rather
 * than inventing a third, parallel field.
 *
 * App-only pages (index.html/profile.html/etc.) already gate whether
 * gtag.js loads AT ALL on privacy.analytics via their own inline script
 * (defaulting to true if unset) - this file doesn't change that. What it
 * adds everywhere: Google Consent Mode v2 (each page's inline gtag block
 * now calls gtag("consent","default",{...denied...}) before gtag.js can
 * set anything), a first-visit banner to make that choice explicit, and
 * an "update" call here once a choice exists so the denied default
 * actually gets lifted when appropriate - without this file, every page
 * would stay permanently denied regardless of what's in pm_profile.
 *
 * Suppressed entirely inside the native app (window.Capacitor) - a
 * browser-style cookie banner doesn't belong in a native WKWebView
 * session, and Apple's own App Tracking Transparency prompt (not a web
 * cookie banner) is the correct native mechanism for ad-tracking consent
 * if that's ever needed there.
 */
(function () {
  if (window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) return;

  function pmProfile() {
    try { return JSON.parse(localStorage.getItem('pm_profile') || '{}'); } catch (e) { return {}; }
  }
  function savePrivacy(patch) {
    const current = pmProfile();
    const merged = { ...current, privacy: { ...current.privacy, ...patch } };
    localStorage.setItem('pm_profile', JSON.stringify(merged));
    if (typeof DB !== 'undefined' && DB.saveProfile) DB.saveProfile(merged);
    return merged;
  }

  function applyConsent(analytics, marketing) {
    if (typeof gtag === 'function') {
      gtag('consent', 'update', {
        analytics_storage: analytics ? 'granted' : 'denied',
        ad_storage: marketing ? 'granted' : 'denied',
        ad_user_data: marketing ? 'granted' : 'denied',
        ad_personalization: marketing ? 'granted' : 'denied',
      });
    }
    if (marketing) captureAttribution();
  }

  /* Marketing attribution - UTM params + ad click IDs, captured into a
     first-party cookie only once marketing consent is granted. A real
     cookie, not localStorage, deliberately: unlike every other
     preference in this app (all localStorage), attribution data is the
     one thing a server-side process could plausibly want to read
     directly off an incoming request later (e.g. crediting a signup to
     a campaign), which is the actual distinguishing capability a cookie
     offers over localStorage here. 90-day Max-Age matches a typical
     attribution window. No-ops harmlessly if none of these params are
     present, which is true for effectively all internal navigation -
     they only show up on the actual landing page from an ad/campaign
     link. */
  function captureAttribution() {
    try {
      const params = new URLSearchParams(location.search);
      const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'];
      const found = {};
      let any = false;
      keys.forEach(k => { const v = params.get(k); if (v) { found[k] = v; any = true; } });
      if (!any) return;
      found.landing_page = location.pathname;
      found.ts = Date.now();
      const value = encodeURIComponent(JSON.stringify(found));
      const maxAge = 90 * 24 * 60 * 60;
      document.cookie = `pm_attribution=${value}; Max-Age=${maxAge}; Path=/; Secure; SameSite=Lax`;
    } catch (e) {}
  }

  const privacy = pmProfile().privacy || {};
  const hasChoice = typeof privacy.analytics === 'boolean' || typeof privacy.personalise === 'boolean';

  /* A choice already exists (Settings, or a previous visit's banner
     interaction) - apply it and skip the banner. Runs on every page
     load, not just the first: gtag's own consent default is always
     re-declared "denied" by each page's inline script, so each fresh
     page needs this to re-lift it. */
  if (hasChoice) {
    applyConsent(privacy.analytics ?? true, privacy.personalise ?? false);
    return;
  }

  /* ── First-visit banner ── */
  function buildBanner() {
    const style = document.createElement('style');
    style.textContent = `
      .pm-cc-banner { position: fixed; left: 0; right: 0; bottom: 0; z-index: 9999;
        display: flex; justify-content: center; padding: 14px;
        padding-bottom: calc(14px + env(safe-area-inset-bottom, 0px));
        transform: translateY(120%); transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
        pointer-events: none; }
      .pm-cc-banner.pm-cc-shown { transform: translateY(0); pointer-events: auto; }
      .pm-cc-card { width: 100%; max-width: 620px; background: rgba(10,36,46,0.94);
        border: 1px solid rgba(255,255,255,0.13); border-radius: 16px;
        backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
        box-shadow: 0 20px 56px rgba(0,0,0,0.45); padding: 18px 20px 16px; color: #fff;
        font-family: 'Montserrat', sans-serif; }
      .pm-cc-top { display: flex; gap: 12px; align-items: flex-start; }
      .pm-cc-icon { flex-shrink: 0; width: 34px; height: 34px; border-radius: 10px;
        background: rgba(95,157,48,0.16); border: 1px solid rgba(95,157,48,0.3);
        display: flex; align-items: center; justify-content: center; }
      .pm-cc-text h2 { font-family: 'Blauer Nue', sans-serif; font-weight: 700;
        font-size: 0.92rem; margin: 2px 0 5px; color: #fff; }
      .pm-cc-text p { font-size: 0.78rem; line-height: 1.5; color: rgba(255,255,255,0.68); margin: 0; }
      .pm-cc-text a { color: #7dcc40; text-decoration: none; font-weight: 600; }
      .pm-cc-actions { display: flex; flex-wrap: wrap; gap: 9px; margin-top: 14px; }
      .pm-cc-btn { font-family: 'Montserrat', sans-serif; font-size: 0.76rem; font-weight: 700;
        border-radius: 9px; padding: 10px 14px; cursor: pointer; border: 1.5px solid transparent;
        transition: all 0.18s; flex: 1; min-width: 110px; text-align: center; }
      .pm-cc-ghost { background: none; border: none; color: rgba(255,255,255,0.42);
        text-decoration: underline; text-underline-offset: 3px; flex: 0 0 auto; min-width: 0; }
      .pm-cc-ghost:hover { color: rgba(255,255,255,0.68); }
      .pm-cc-outline { background: transparent; border-color: rgba(95,157,48,0.5); color: #7dcc40; }
      .pm-cc-outline:hover { background: rgba(95,157,48,0.12); }
      .pm-cc-primary { background: #5f9d30; border-color: #5f9d30; color: #fff; }
      .pm-cc-primary:hover { background: #4d8225; }
      .pm-cc-panel { overflow: hidden; max-height: 0; opacity: 0;
        transition: max-height 0.3s ease, opacity 0.25s ease, margin-top 0.3s ease; }
      .pm-cc-panel.pm-cc-open { max-height: 300px; opacity: 1; margin-top: 14px; }
      .pm-cc-panel-inner { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 12px; }
      .pm-cc-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 9px 0; }
      .pm-cc-row + .pm-cc-row { border-top: 1px solid rgba(255,255,255,0.1); }
      .pm-cc-row-text strong { display: block; font-size: 0.78rem; color: #fff; margin-bottom: 2px; }
      .pm-cc-row-text span { display: block; font-size: 0.7rem; color: rgba(255,255,255,0.42); line-height: 1.4; }
      .pm-cc-switch { position: relative; width: 38px; height: 22px; flex-shrink: 0; }
      .pm-cc-switch input { opacity: 0; width: 0; height: 0; }
      .pm-cc-slider { position: absolute; inset: 0; border-radius: 99px; cursor: pointer;
        background: rgba(255,255,255,0.18); transition: background 0.2s; }
      .pm-cc-slider::before { content: ''; position: absolute; width: 16px; height: 16px; left: 3px; top: 3px;
        border-radius: 50%; background: #fff; transition: transform 0.2s; }
      .pm-cc-switch input:checked + .pm-cc-slider { background: #5f9d30; }
      .pm-cc-switch input:checked + .pm-cc-slider::before { transform: translateX(16px); }
      .pm-cc-switch input:disabled + .pm-cc-slider { background: rgba(125,204,64,0.45); cursor: not-allowed; }
      .pm-cc-save-row { display: flex; justify-content: flex-end; margin-top: 12px; }
      .pm-cc-save-row .pm-cc-btn { flex: 0 0 auto; min-width: 130px; }
      .pm-cc-reopen { position: fixed; left: 16px; bottom: 16px; bottom: calc(16px + env(safe-area-inset-bottom, 0px));
        z-index: 9998; display: flex; align-items: center; gap: 7px;
        background: rgba(10,36,46,0.94); border: 1px solid rgba(255,255,255,0.13);
        border-radius: 99px; padding: 9px 14px 9px 11px; font-size: 0.7rem; font-weight: 600;
        color: rgba(255,255,255,0.65); cursor: pointer; box-shadow: 0 8px 22px rgba(0,0,0,0.3);
        font-family: 'Montserrat', sans-serif;
        opacity: 0; transform: translateY(10px) scale(0.92); pointer-events: none;
        transition: all 0.3s cubic-bezier(0.16,1,0.3,1); }
      .pm-cc-reopen.pm-cc-shown { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }
      @media (max-width: 480px) {
        .pm-cc-actions { flex-direction: column; }
        .pm-cc-btn { min-width: 0; }
        .pm-cc-ghost { order: 3; text-align: center; }
      }
    `;
    document.head.appendChild(style);

    const wrap = document.createElement('div');
    wrap.className = 'pm-cc-banner';
    wrap.id = 'pmCookieBanner';
    wrap.innerHTML = `
      <div class="pm-cc-card">
        <div class="pm-cc-top">
          <div class="pm-cc-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7dcc40" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a9.5 9.5 0 100 19 7 7 0 01-7-7c0-.34.02-.67.07-1A3 3 0 019 10a3 3 0 003-3 3 3 0 013-3c.33 0 .65.03.97.07A9.5 9.5 0 0012 2z"/><circle cx="8.5" cy="11.5" r="0.8" fill="#7dcc40"/><circle cx="13.5" cy="15.5" r="0.8" fill="#7dcc40"/><circle cx="15.5" cy="8.5" r="0.8" fill="#7dcc40"/></svg>
          </div>
          <div class="pm-cc-text">
            <h2>We use cookies</h2>
            <p>Essential cookies keep the site working. With your permission, we'd also like to use analytics and marketing cookies to understand usage and improve Packmates AI. See our <a href="privacy.html">Privacy Policy</a>.</p>
          </div>
        </div>
        <div class="pm-cc-panel" id="pmCcPanel">
          <div class="pm-cc-panel-inner">
            <div class="pm-cc-row">
              <div class="pm-cc-row-text"><strong>Essential</strong><span>Required for login, security, and core features. Can't be turned off.</span></div>
              <label class="pm-cc-switch"><input type="checkbox" checked disabled><span class="pm-cc-slider"></span></label>
            </div>
            <div class="pm-cc-row">
              <div class="pm-cc-row-text"><strong>Analytics</strong><span>Helps us see which features people actually use.</span></div>
              <label class="pm-cc-switch"><input type="checkbox" id="pmCcAnalytics" checked><span class="pm-cc-slider"></span></label>
            </div>
            <div class="pm-cc-row">
              <div class="pm-cc-row-text"><strong>Marketing</strong><span>Lets us measure which campaigns bring people to Packmates AI.</span></div>
              <label class="pm-cc-switch"><input type="checkbox" id="pmCcMarketing" checked><span class="pm-cc-slider"></span></label>
            </div>
          </div>
          <div class="pm-cc-save-row"><button class="pm-cc-btn pm-cc-primary" id="pmCcSave">Save Preferences</button></div>
        </div>
        <div class="pm-cc-actions">
          <button class="pm-cc-btn pm-cc-ghost" id="pmCcManage">Manage Preferences</button>
          <button class="pm-cc-btn pm-cc-outline" id="pmCcReject">Reject Non-Essential</button>
          <button class="pm-cc-btn pm-cc-primary" id="pmCcAccept">Accept All</button>
        </div>
      </div>
    `;
    document.body.appendChild(wrap);

    const reopen = document.createElement('div');
    reopen.className = 'pm-cc-reopen';
    reopen.id = 'pmCcReopen';
    reopen.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="8" r="1"/><circle cx="16" cy="12" r="1"/><circle cx="12" cy="16" r="1"/></svg>
      <span>Cookie Settings</span>`;
    document.body.appendChild(reopen);

    /* Keep clear of the bottom nav (index.html/profile.html/etc. show it
       only below a mobile-width breakpoint - style.css's .bottom-nav is
       display:none above that) - measure it live rather than assuming
       which pages do or don't have one. */
    function avoidBottomNav() {
      const nav = document.querySelector('.bottom-nav');
      const offset = nav && getComputedStyle(nav).display !== 'none' ? nav.offsetHeight + 10 : 0;
      wrap.style.bottom = offset + 'px';
      reopen.style.bottom = `calc(${offset + 16}px + env(safe-area-inset-bottom, 0px))`;
    }
    avoidBottomNav();
    window.addEventListener('resize', avoidBottomNav);

    return { wrap, reopen };
  }

  /* This file is loaded as a plain <script src> in <head> (so the
     Consent Mode default set further up runs as early as possible),
     which means document.body doesn't exist yet at this point - defer
     the actual banner DOM/layout work (buildBanner() appends to body,
     and measures .bottom-nav's real layout) until it does. */
  function initBanner() {
    const { wrap, reopen } = buildBanner();
    const panel = document.getElementById('pmCcPanel');
    const manageBtn = document.getElementById('pmCcManage');

    function showBanner() { wrap.classList.add('pm-cc-shown'); reopen.classList.remove('pm-cc-shown'); }
    function hideBanner() { wrap.classList.remove('pm-cc-shown'); setTimeout(() => reopen.classList.add('pm-cc-shown'), 250); }

    document.getElementById('pmCcAccept').addEventListener('click', () => {
      savePrivacy({ analytics: true, personalise: true });
      applyConsent(true, true);
      hideBanner();
    });
    document.getElementById('pmCcReject').addEventListener('click', () => {
      savePrivacy({ analytics: false, personalise: false });
      applyConsent(false, false);
      hideBanner();
    });
    document.getElementById('pmCcSave').addEventListener('click', () => {
      const analytics = document.getElementById('pmCcAnalytics').checked;
      const marketing = document.getElementById('pmCcMarketing').checked;
      savePrivacy({ analytics, personalise: marketing });
      applyConsent(analytics, marketing);
      hideBanner();
    });
    manageBtn.addEventListener('click', () => {
      const isOpen = panel.classList.toggle('pm-cc-open');
      manageBtn.textContent = isOpen ? 'Hide Preferences' : 'Manage Preferences';
    });
    reopen.addEventListener('click', showBanner);

    setTimeout(showBanner, 500);
  }

  if (document.body) initBanner();
  else document.addEventListener('DOMContentLoaded', initBanner);
})();
