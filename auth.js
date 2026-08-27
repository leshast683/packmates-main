/**
 * Packmates AI — Auth layer: Supabase backend + localStorage fallback for existing users.
 * New users  → Supabase Auth (PostgreSQL).
 * Old users  → verified locally, then auto-migrated to Supabase on first login.
 */

/* ── Native splash screen safety net ─────────────────────────────────────
   capacitor.config.json sets SplashScreen.launchAutoHide:false so it stays
   up until explicitly hidden — welcome.html hides it once its icon
   carousel has actually finished preloading, and index.html hides it
   immediately for an already-logged-in user who lands there directly with
   nothing extra to wait for. This is a pure safety net on top of those:
   if some other entry point ever forgets to call hide(), or one of those
   two calls never fires for an unexpected reason, the whole app would
   otherwise be stuck behind the splash screen forever instead of just
   showing content a bit later than ideal. */
(function () {
  if (!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform())) return;
  setTimeout(function () {
    try { window.Capacitor.Plugins.SplashScreen.hide(); } catch (e) {}
  }, 4000);
})();

/* ── Supabase CDN + client ───────────────────────────────────────────── */
const _SB_URL  = 'https://ocwqpeyfxsovkqbmzlgh.supabase.co';
const _SB_KEY  = 'sb_publishable_xS8gLHbIxrR62lI178O3ag_DtXp66Rv';
/* Supabase JS v2 persists the session at this key */
const _SB_LKEY = 'sb-ocwqpeyfxsovkqbmzlgh-auth-token';

let _sbClient = null;
/* Load Supabase CDN once, resolve with the created client */
window._pm_sbLoaded = new Promise(resolve => {
  const _init = () => {
    try {
      _sbClient = window.supabase.createClient(_SB_URL, _SB_KEY, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
      });
      window._pm_sb = _sbClient;

      /* Redirect to login when session truly expires (not on intentional logout) */
      _sbClient.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_OUT' && !window._pm_intentional_signout) {
          const pub = ['welcome.html','login.html','signup.html','reset.html'];
          if (!pub.some(p => location.pathname.endsWith(p))) {
            /* window.top, not location: the native app's app-shell (see
               lib/app-shell.js) keeps several of these pages alive at once
               in background iframes, each running its own independent copy
               of this script/client. Redirecting via plain `location` would
               only navigate whichever single frame happened to detect the
               sign-out, leaving other live frames stuck showing stale
               content behind a login screen only one of them shows. Always
               collapsing to the top window means the whole app reacts
               once, consistently, regardless of which frame noticed first.
               No-op on the public website, where top is always self. */
            window.top.location.replace('login.html?expired=1');
          }
        }
      });
    } catch(e) { console.error('[Auth] Supabase init failed:', e); Auth.logError(e, { where: 'sb init' }); }
    resolve(_sbClient);
  };
  if (window.supabase) { _init(); return; }
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
  s.onload  = _init;
  s.onerror = () => { console.warn('[Auth] CDN unavailable – using localStorage fallback.'); resolve(null); };
  document.head.appendChild(s);
});

async function _getSb() {
  if (_sbClient) return _sbClient;
  return await window._pm_sbLoaded;
}

/* ── Legacy localStorage helpers ─────────────────────────────────────── */
const _USERS_KEY  = 'pm_users';
const _SESS_KEY   = 'pm_session';
const _SAVED_KEY  = 'pm_saved_email';
const _SCHEMA_VER = 2;

function _localUsers()    { try { return JSON.parse(localStorage.getItem(_USERS_KEY) || '[]'); } catch { return []; } }
function _saveLocalUsers(u) { localStorage.setItem(_USERS_KEY, JSON.stringify(u)); }

function _djb2(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i);
  return (h >>> 0).toString(36);
}
async function _sha256(str, salt = '') {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}
function _salt() {
  return Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b => b.toString(16).padStart(2,'0')).join('');
}
const _legacy = h => !h || h.length < 20;

async function _verifyLocal(norm, pw) {
  const users = _localUsers();
  const idx = users.findIndex(u => u.email.toLowerCase() === norm);
  if (idx === -1) return null;
  const u = users[idx];
  const valid = _legacy(u.pwHash)
    ? _djb2(pw) === u.pwHash
    : (await _sha256(pw, u.salt || '')) === u.pwHash;
  if (valid && _legacy(u.pwHash)) {
    /* upgrade hash in place */
    const s = _salt();
    u.pwHash = await _sha256(pw, s); u.salt = s;
    users[idx] = u; _saveLocalUsers(users);
  }
  return valid ? u : null;
}

/* ── Read Supabase cached user synchronously (no CDN needed) ──────────── */
function _sbCachedUser() {
  try {
    const raw = localStorage.getItem(_SB_LKEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (p?.expires_at && Date.now() / 1000 > p.expires_at) return null;
    return p?.user || null;
  } catch { return null; }
}

/* ── Migrate localStorage data → Supabase (runs once per user per device) */
async function _migrateLocalData(sbUser) {
  const migKey = 'pm_sb_migrated_' + sbUser.id;
  if (localStorage.getItem(migKey)) return;
  try {
    const sb = await _getSb();
    if (!sb) return;

    const localTrips = JSON.parse(localStorage.getItem('pm_trips') || '[]');
    for (const t of localTrips) {
      if (!t.id) continue;
      await sb.from('trips').upsert({
        id: t.id, user_id: sbUser.id,
        destination: t.destination || '', from_date: t.fromDate || null,
        to_date: t.toDate || null, travelers: t.travelers || 1,
        activities: t.activities || [], country: t.country || null,
        image_url: t.imageUrl || null, invite_code: t.inviteCode || t.id,
        owner_email: t.ownerEmail || sbUser.email,
        created_at: t.createdAt || new Date().toISOString(),
        data: t,
      }, { onConflict: 'id', ignoreDuplicates: true });

      const packRaw = JSON.parse(localStorage.getItem(`pm_pack_${t.id}`) || '{}');
      if (Object.keys(packRaw).length) {
        await sb.from('packing_state').upsert({
          trip_id: t.id, user_id: sbUser.id,
          item_state:   packRaw.itemState   || {},
          dismissed:    packRaw.dismissed   || [],
          custom_items: packRaw.customItems || {},
        }, { onConflict: 'trip_id,user_id', ignoreDuplicates: true });
      }
    }

    const lp = JSON.parse(localStorage.getItem('pm_profile') || 'null');
    if (lp) {
      await sb.from('profiles').upsert({
        id: sbUser.id,
        name:     lp.name    || sbUser.user_metadata?.name || '',
        handle:   lp.handle  || null,
        avatar:   lp.avatar  || null,
        gender:   lp.gender  || sbUser.user_metadata?.gender || null,
        pd_name:  lp.pdName  || null,
        pd_email: lp.pdEmail || null,
        pd_phone: lp.pdPhone || null,
        notif:    lp.notif   || {},
        privacy:  lp.privacy || {},
      }, { onConflict: 'id' });
    }

    localStorage.setItem(migKey, '1');
    console.log('[Auth] Migrated local data → Supabase.');
  } catch(e) { console.error('[Auth] Migration error:', e); Auth.logError(e, { where: 'migration' }); }
}

/* ── Auth ────────────────────────────────────────────────────────────── */
const Auth = (() => {

  return {
    /* ── Register ── */
    async register(name, email, pw, gender) {
      const norm = email.trim().toLowerCase();
      if (!name.trim())        return { success: false, error: 'Please enter your name.' };
      if (!norm.includes('@')) return { success: false, error: 'Please enter a valid email.' };
      if (pw.length < 6)       return { success: false, error: 'Password must be at least 6 characters.' };
      if (!gender)             return { success: false, error: 'Please select your gender.' };

      const sb = await _getSb();
      if (!sb) return this._localRegister(name, norm, pw, gender);

      let data, error;
      try {
        ({ data, error } = await sb.auth.signUp({
          email: norm, password: pw,
          options: {
            data: { name: name.trim(), gender },
            emailRedirectTo: 'https://packmatesai.com/welcome.html',
          }
        }));
      } catch (e) {
        return { success: false, error: 'Connection error. Please check your internet and try again.' };
      }

      if (error) {
        const msg = error.message || error.error_description || error.msg
          || (error.code ? String(error.code) : '') || '';
        if (!msg || msg === '{}' || msg === 'null')
          return { success: false, error: 'Sign up failed. Please try again.' };
        if (msg.toLowerCase().includes('sending') || msg.toLowerCase().includes('smtp') || error.status === 500)
          return { success: false, error: 'We couldn\'t send a confirmation email. Please try again in a few minutes.' };
        if (msg.toLowerCase().includes('rate limit') || msg.toLowerCase().includes('too many') || error.status === 429)
          return { success: false, error: 'Too many attempts. Please wait a few minutes and try again.' };
        if (msg.includes('already registered') || msg.includes('already exists') || msg.includes('already been registered'))
          return { success: false, error: 'An account with this email already exists.' };
        return { success: false, error: msg };
      }
      if (!data?.user)
        return { success: false, error: 'An account with this email already exists. Try logging in instead.' };
      /* Profile row is auto-created by the DB trigger.
         data.session is only populated here if Supabase's "Confirm
         email" requirement is OFF for this project - in that case the
         account is immediately usable and the caller should skip
         straight to the app instead of showing a blocking "check your
         email" screen. If confirmation is still required, session is
         null and the caller falls back to that screen as before. */
      return { success: true, session: data?.session || null };
    },

    async _localRegister(name, norm, pw, gender) {
      const users = _localUsers();
      if (pw.length < 8) return { success: false, error: 'Password must be at least 8 characters.' };
      if (users.find(u => u.email.toLowerCase() === norm))
        return { success: false, error: 'An account with this email already exists.' };
      const s = _salt();
      users.push({ name: name.trim(), email: norm, pwHash: await _sha256(pw, s), salt: s, gender });
      _saveLocalUsers(users);
      localStorage.setItem(_SESS_KEY, JSON.stringify({ email: norm, name: name.trim(), gender, loginAt: Date.now() }));
      return { success: true };
    },

    /* ── Login ── */
    async login(email, pw, remember = false) {
      const norm = email.trim().toLowerCase();
      const sb = await _getSb();

      if (sb) {
        /* 1. Try Supabase */
        const { data, error } = await sb.auth.signInWithPassword({ email: norm, password: pw });
        if (!error && data?.user) {
          if (remember) localStorage.setItem(_SAVED_KEY, norm); else localStorage.removeItem(_SAVED_KEY);
          _migrateLocalData(data.user); /* fire-and-forget */
          return { success: true };
        }

        /* 2a. Email not confirmed yet */
        if (error?.message?.includes('Email not confirmed') || error?.message?.includes('email_not_confirmed')) {
          return { success: false, error: 'EMAIL_NOT_CONFIRMED' };
        }

        /* 2b. Supabase says wrong credentials — check legacy localStorage account */
        const isCredErr = error?.message?.includes('Invalid login') || error?.message?.includes('invalid_credentials');
        if (isCredErr) {
          const localUser = await _verifyLocal(norm, pw);
          if (localUser) {
            /* Auto-create Supabase account for this existing user */
            const { data: sd, error: se } = await sb.auth.signUp({
              email: norm, password: pw,
              options: { data: { name: localUser.name, gender: localUser.gender } }
            });
            if (!se && sd?.user) {
              /* Try immediate sign-in (works when email confirm is disabled) */
              const { data: si, error: sie } = await sb.auth.signInWithPassword({ email: norm, password: pw });
              if (!sie && si?.user) {
                if (remember) localStorage.setItem(_SAVED_KEY, norm); else localStorage.removeItem(_SAVED_KEY);
                _migrateLocalData(si.user);
                return { success: true };
              }
            }
            /* Email confirm required or other issue — fall back to local session */
            localStorage.setItem(_SESS_KEY, JSON.stringify({ email: norm, name: localUser.name, gender: localUser.gender, loginAt: Date.now() }));
            if (remember) localStorage.setItem(_SAVED_KEY, norm); else localStorage.removeItem(_SAVED_KEY);
            return { success: true };
          }
          return { success: false, error: 'No account found with this email or password is incorrect.' };
        }

        /* Other Supabase error (network, etc.) */
        if (error) return { success: false, error: error.message };
      }

      /* No Supabase CDN — pure local auth */
      const localUser = await _verifyLocal(norm, pw);
      if (!localUser) return { success: false, error: 'Incorrect email or password.' };
      localStorage.setItem(_SESS_KEY, JSON.stringify({ email: norm, name: localUser.name, gender: localUser.gender, loginAt: Date.now() }));
      if (remember) localStorage.setItem(_SAVED_KEY, norm); else localStorage.removeItem(_SAVED_KEY);
      return { success: true };
    },

    /* ── Change password ── */
    async changePassword(currentPw, newPw) {
      const session = this.getSession();
      if (!session) return { success: false, error: 'Not logged in.' };
      const sb = await _getSb();

      if (sb && _sbCachedUser()) {
        const { error: ve } = await sb.auth.signInWithPassword({ email: session.email, password: currentPw });
        if (ve) return { success: false, error: 'Current password is incorrect.' };
        const { error } = await sb.auth.updateUser({ password: newPw });
        if (error) return { success: false, error: error.message };
        return { success: true };
      }

      /* local fallback */
      const users = _localUsers();
      const idx = users.findIndex(u => u.email === session.email);
      if (idx === -1) return { success: false, error: 'Account not found.' };
      const u = users[idx];
      const valid = _legacy(u.pwHash) ? _djb2(currentPw) === u.pwHash : (await _sha256(currentPw, u.salt || '')) === u.pwHash;
      if (!valid) return { success: false, error: 'Current password is incorrect.' };
      const s = _salt();
      u.pwHash = await _sha256(newPw, s); u.salt = s;
      users[idx] = u; _saveLocalUsers(users);
      return { success: true };
    },

    /* ── Reset password (local accounts only — Supabase uses email link) ── */
    async resetPassword(email, newPw) {
      const norm = email.trim().toLowerCase();
      const users = _localUsers();
      const idx = users.findIndex(u => u.email.toLowerCase() === norm);
      if (idx === -1) return { success: false, error: 'No account found with this email.' };
      const s = _salt();
      users[idx].pwHash = await _sha256(newPw, s);
      users[idx].salt   = s;
      _saveLocalUsers(users);
      return { success: true };
    },

    /* ── Async token (refreshes if near expiry) ── */
    async getTokenAsync() {
      const client = await _getSb();
      if (client) {
        const { data } = await client.auth.getSession();
        return data?.session?.access_token || '';
      }
      return this.getToken();
    },

    /* ── Resend signup confirmation email ── */
    async resendConfirmation(email) {
      const client = await _getSb();
      if (!client) return { success: false, error: 'Service unavailable.' };
      const { error } = await client.auth.resend({ type: 'signup', email: email.trim().toLowerCase() });
      if (error) return { success: false, error: error.message };
      return { success: true };
    },

    /* ── Send password-reset link via Supabase email ── */
    async sendPasswordReset(email) {
      const client = await _getSb();
      if (!client) return { success: false, error: 'Password reset via email is not available offline.' };
      const { error } = await client.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: 'https://packmatesai.com/reset.html',
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    },

    /* ── Google OAuth ── */
    async loginWithGoogle() {
      const client = await _getSb();
      if (!client) return { success: false, error: 'Google sign-in unavailable.' };
      const { error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: 'https://packmatesai.com/welcome.html' },
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    },

    /* ── Logout ── */
    logout() {
      window._pm_intentional_signout = true;
      localStorage.removeItem(_SB_LKEY);
      localStorage.removeItem(_SESS_KEY);
      if (_sbClient) { _sbClient.auth.signOut().catch(() => {}); }
    },

    /* ── Session (synchronous) ── */
    getSession() {
      const sbUser = _sbCachedUser();
      if (sbUser) {
        return {
          email:    sbUser.email,
          name:     sbUser.user_metadata?.name || sbUser.email?.split('@')[0] || 'Traveler',
          gender:   sbUser.user_metadata?.gender || null,
          loginAt:  Date.now(),
          userId:   sbUser.id,
        };
      }
      try {
        const s = JSON.parse(localStorage.getItem(_SESS_KEY) || 'null');
        if (!s) return null;
        if (s.loginAt && Date.now() - s.loginAt > 30 * 24 * 60 * 60 * 1000) {
          localStorage.removeItem(_SESS_KEY); return null;
        }
        return s;
      } catch { return null; }
    },

    /* True/false/null (Supabase not in use / local-only account, where
       confirmation doesn't apply). For the non-blocking "please verify
       your email" reminder - never used to gate access, see
       requireAuth(). */
    isEmailConfirmed() {
      const sbUser = _sbCachedUser();
      if (!sbUser) return null;
      return !!sbUser.email_confirmed_at;
    },

    isLoggedIn()  { return !!this.getSession(); },
    /* Returns the Supabase access token for authenticated API calls */
    getToken() {
      try {
        return JSON.parse(localStorage.getItem(_SB_LKEY) || 'null')?.access_token || '';
      } catch { return ''; }
    },
    /* Fire-and-forget error report — never throws, never blocks the caller.
       Silently no-ops when logged out (nothing to attribute the error to). */
    logError(message, extra) {
      try {
        const token = this.getToken();
        if (!token) return;
        fetch('/api/log-error', {
          method: 'POST',
          headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            message: String(message?.message || message || 'Unknown error'),
            stack: message?.stack || '',
            page: location.pathname,
            context: extra || {},
          }),
        }).catch(() => {});
      } catch {}
    },
    requireAuth(redirect = 'welcome.html') {
      if (!this.isLoggedIn()) { location.replace(redirect); return false; }
      /* Email confirmation is non-blocking by design - an unconfirmed
         user still gets a real session at signup and should be able to
         use the app immediately. See isEmailConfirmed() for the
         non-blocking "please verify" reminder instead of gating access
         here. */
      return true;
    },
    getSavedEmail() { return localStorage.getItem(_SAVED_KEY) || ''; },

    /* ── Export ── */
    exportData() {
      const session = this.getSession();
      const email   = session?.email || '';
      const trips   = JSON.parse(localStorage.getItem('pm_trips') || '[]')
                        .filter(t => !email || t.ownerEmail === email || !t.ownerEmail);
      const packStates = {};
      trips.forEach(t => { try { packStates[t.id] = JSON.parse(localStorage.getItem(`pm_pack_${t.id}`) || 'null'); } catch {} });
      const blob = new Blob([JSON.stringify({
        exportedAt: new Date().toISOString(),
        account:    { name: session?.name, email, gender: session?.gender },
        profile:    JSON.parse(localStorage.getItem('pm_profile') || 'null'),
        trips, packStates,
      }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `packmates-data-${new Date().toISOString().slice(0,10)}.json`;
      a.click(); URL.revokeObjectURL(url);
    },

    /* ── Delete account ── */
    async deleteAccount() {
      const session = this.getSession();
      const email   = session?.email || '';

      /* Server-side: delete all Supabase rows + auth user */
      const token = this.getToken();
      if (token) {
        try {
          await fetch('/api/delete-account', {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch { /* non-fatal — still wipe local data */ }
      }

      /* Local cleanup */
      const trips = JSON.parse(localStorage.getItem('pm_trips') || '[]');
      trips.filter(t => !email || t.ownerEmail === email || !t.ownerEmail)
           .forEach(t => localStorage.removeItem(`pm_pack_${t.id}`));
      const remaining = trips.filter(t => email && t.ownerEmail && t.ownerEmail !== email);
      localStorage.setItem('pm_trips', JSON.stringify(remaining));
      ['pm_session','pm_profile','currentTrip','pm_tip_videos','pm_tip_idx','pm_tip_ver',
       'pm_packmates', _SB_LKEY, `pm_notifications_${email}`, `pm_sb_migrated_${session?.userId||''}`]
        .forEach(k => localStorage.removeItem(k));
      _saveLocalUsers(_localUsers().filter(u => u.email !== email));
      window._pm_intentional_signout = true;
      if (_sbClient) { try { await _sbClient.auth.signOut(); } catch {} }
      location.replace('welcome.html');
    },

    /* ── Legacy migration v1→v2 ── */
    migrate() {
      if (parseInt(localStorage.getItem('pm_schema_ver') || '0') >= _SCHEMA_VER) return;
      try {
        const trips = JSON.parse(localStorage.getItem('pm_trips') || '[]');
        trips.forEach(t => {
          if (!t.id) return;
          if (!localStorage.getItem(`pm_pack_${t.id}`))
            localStorage.setItem(`pm_pack_${t.id}`, JSON.stringify({ itemState: t.packItemState||{}, dismissed: t.packDismissed||[], customItems: t.packCustom||{} }));
          delete t.packState; delete t.packItemState; delete t.packDismissed; delete t.packCustom;
        });
        localStorage.setItem('pm_trips', JSON.stringify(trips));
      } catch {}
      try {
        const cur = JSON.parse(localStorage.getItem('currentTrip') || 'null');
        if (cur?.id && !localStorage.getItem(`pm_pack_${cur.id}`)) {
          localStorage.setItem(`pm_pack_${cur.id}`, JSON.stringify({
            itemState:   JSON.parse(localStorage.getItem('packingItemState')   || '{}'),
            dismissed:   JSON.parse(localStorage.getItem('packingDismissed')   || '[]'),
            customItems: JSON.parse(localStorage.getItem('packingCustomItems') || '{}'),
          }));
        }
      } catch {}
      ['packingState','packingItemState','packingDismissed','packingCustomItems'].forEach(k => localStorage.removeItem(k));
      try {
        if (!localStorage.getItem('pm_profile')) {
          localStorage.setItem('pm_profile', JSON.stringify({
            name: localStorage.getItem('pm_name')||'', handle: localStorage.getItem('pm_handle')||'',
            avatar: localStorage.getItem('pm_avatar')||'', pdName: localStorage.getItem('pm_pd_name')||'',
            pdEmail: localStorage.getItem('pm_pd_email')||'', pdPhone: localStorage.getItem('pm_pd_phone')||'',
            notif:   JSON.parse(localStorage.getItem('pm_notif')   || 'null') || {},
            privacy: JSON.parse(localStorage.getItem('pm_privacy') || 'null') || {},
          }));
          ['pm_name','pm_handle','pm_avatar','pm_pd_name','pm_pd_email','pm_pd_phone','pm_notif','pm_privacy'].forEach(k => localStorage.removeItem(k));
        }
      } catch {}
      try {
        const s = JSON.parse(localStorage.getItem(_SESS_KEY) || 'null');
        if (s?.email) {
          const trips = JSON.parse(localStorage.getItem('pm_trips') || '[]');
          let dirty = false;
          trips.forEach(t => { if (!t.ownerEmail) { t.ownerEmail = s.email; dirty = true; } });
          if (dirty) localStorage.setItem('pm_trips', JSON.stringify(trips));
        }
      } catch {}
      try { _saveLocalUsers(_localUsers().map(u => ({ ...u, email: u.email.toLowerCase() }))); } catch {}
      localStorage.setItem('pm_schema_ver', _SCHEMA_VER);
    },
  };
})();

Auth.migrate();

/* ── DB layer: localStorage cache + Supabase background sync ────────── */
const DB = (() => {
  function _uid() {
    try {
      const raw = localStorage.getItem('sb-ocwqpeyfxsovkqbmzlgh-auth-token');
      if (!raw) return null;
      const p = JSON.parse(raw);
      if (p?.expires_at && Date.now() / 1000 > p.expires_at) return null;
      return p?.user?.id || null;
    } catch { return null; }
  }

  async function sb() { return window._pm_sb || await window._pm_sbLoaded || null; }

  /* trips columns: just id/user_id/invite_code/created_at + the full
     object in `data` — see supabase/migrations for why the old per-field
     columns were dropped. */
  function _tripRow(t, uid) {
    return {
      id: t.id, user_id: uid,
      invite_code: t.inviteCode || t.id,
      created_at: t.createdAt || new Date().toISOString(),
      data: t,
    };
  }

  /* debounce helper for high-frequency saves (packing state) */
  const _timers = {};
  function _debounce(key, fn, ms = 2000) {
    clearTimeout(_timers[key]);
    _timers[key] = setTimeout(fn, ms);
  }

  /* ── Sync guards ──────────────────────────────────────────────────────
     syncTrips()/syncPackState() pull-and-overwrite localStorage from the
     server. Without a guard, a sync that lands while a local write is
     still in flight (debounce delay + network round-trip) would stomp
     the fresh local edit with stale server data. SYNC_GRACE_MS covers
     savePackState's 2s debounce plus a margin for the request itself;
     the flag is cleared as soon as the write is confirmed so a real
     server-side change (e.g. from another device) isn't blocked longer
     than necessary. See lib/sync-guard.js (tested in test/sync-guard.test.js). */
  const SYNC_GRACE_MS = 4000;
  const _tripsGuard = SyncGuard.createGraceGuard(SYNC_GRACE_MS);
  const _packGuards = {};
  function _packGuard(tripId) {
    return _packGuards[tripId] || (_packGuards[tripId] = SyncGuard.createGraceGuard(SYNC_GRACE_MS));
  }

  return {
    /* save trip to localStorage + Supabase. Returns { success, error } —
       the server write is genuinely awaited (not fire-and-forget) so a
       real failure (network, RLS, a validation constraint) can actually
       be surfaced to the user instead of silently vanishing while the
       UI proceeds as if it worked. */
    async saveTrip(tripData) {
      const uid = _uid();
      /* RLS only ever lets the owner upsert a trips row (see
         _tripRow below) — anything passed through here is, by
         definition, owned by whoever's calling it. */
      if (uid) tripData = { ...tripData, _ownerId: uid };
      const trips = JSON.parse(localStorage.getItem('pm_trips') || '[]');
      const idx = trips.findIndex(t => t.id === tripData.id);
      if (idx >= 0) trips[idx] = tripData; else trips.push(tripData);
      localStorage.setItem('pm_trips', JSON.stringify(trips));
      localStorage.setItem('currentTrip', JSON.stringify(tripData));
      _tripsGuard.markDirty();
      const client = await sb();
      if (!client || !uid) return { success: true };
      const { error } = await client.from('trips').upsert(_tripRow(tripData, uid), { onConflict: 'id' });
      if (error) {
        console.error('[DB] saveTrip:', error.message);
        Auth.logError(error.message, { where: 'saveTrip' });
        return { success: false, error: error.message };
      }
      _tripsGuard.clear();
      return { success: true };
    },

    /* delete trip from localStorage + Supabase. Returns { success, error } —
       genuinely awaited (not fire-and-forget) since callers reload the
       page right after calling this; a page navigation cancels any
       fetch still in flight, so an un-awaited delete could get cut off
       before it ever reached the server. */
    async deleteTrip(tripId) {
      const trips = JSON.parse(localStorage.getItem('pm_trips') || '[]');
      const remaining = trips.filter(t => t.id !== tripId);
      localStorage.setItem('pm_trips', JSON.stringify(remaining));
      localStorage.removeItem(`pm_pack_${tripId}`);
      const cur = JSON.parse(localStorage.getItem('currentTrip') || 'null');
      if (cur?.id === tripId) {
        remaining.length
          ? localStorage.setItem('currentTrip', JSON.stringify(remaining[remaining.length - 1]))
          : localStorage.removeItem('currentTrip');
      }
      _tripsGuard.markDirty();
      const client = await sb(); const uid = _uid();
      if (!client || !uid) return { success: true };

      /* Try an owner-delete first — RLS only allows this to affect a row
         if the caller owns it, so .select('id') tells us whether it
         actually happened. If it didn't (0 rows), the caller is a
         member who joined someone else's trip: "delete" means "leave"
         for them instead — drop their own membership + pack state,
         leave the trip itself intact for the owner and other members. */
      const { data: deletedRows, error } = await client.from('trips').delete().eq('id', tripId).select('id');
      if (error) {
        console.error('[DB] deleteTrip:', error.message);
        Auth.logError(error.message, { where: 'deleteTrip' });
        return { success: false, error: error.message };
      }
      _tripsGuard.clear();

      if (deletedRows?.length) {
        const { error: packErr } = await client.from('packing_state').delete().eq('trip_id', tripId).eq('user_id', uid);
        if (packErr) { console.error('[DB] deletePackState:', packErr.message); Auth.logError(packErr.message, { where: 'deletePackState' }); }
      } else {
        const { error: memberErr } = await client.from('trip_members').delete().eq('trip_id', tripId).eq('user_id', uid);
        if (memberErr) { console.error('[DB] leaveTrip:', memberErr.message); Auth.logError(memberErr.message, { where: 'leaveTrip' }); }
        const { error: packErr } = await client.from('packing_state').delete().eq('trip_id', tripId).eq('user_id', uid);
        if (packErr) { console.error('[DB] leaveTrip packState:', packErr.message); Auth.logError(packErr.message, { where: 'leaveTrip packState' }); }
      }
      return { success: true };
    },

    /* save packing state to localStorage + Supabase (debounced) */
    savePackState(tripId, state) {
      localStorage.setItem(`pm_pack_${tripId}`, JSON.stringify(state));
      _packGuard(tripId).markDirty();
      _debounce('pack_' + tripId, async () => {
        const client = await sb(); const uid = _uid();
        if (!client || !uid) return;
        const payload = {
          trip_id: tripId, user_id: uid,
          item_state:   state.itemState   || {},
          dismissed:    state.dismissed   || [],
          custom_items: state.customItems || {},
          finished:     !!state.finished,
        };
        let { error } = await client.from('packing_state').upsert(payload, { onConflict: 'trip_id,user_id' });
        if (error && /finished/.test(error.message || '')) {
          /* packing_state.finished migration not applied yet on this
             project — retry without it so item_state/dismissed/
             custom_items still sync instead of the whole row failing. */
          delete payload.finished;
          ({ error } = await client.from('packing_state').upsert(payload, { onConflict: 'trip_id,user_id' }));
        }
        if (error) { console.error('[DB] savePackState:', error.message); Auth.logError(error.message, { where: 'savePackState' }); }
        else { _packGuard(tripId).clear(); }
      }, 2000);
    },

    /* pull trips from Supabase → update localStorage (returns true if updated) */
    async syncTrips() {
      if (_tripsGuard.isDirty()) return false;
      const client = await sb(); const uid = _uid();
      if (!client || !uid) return false;
      /* No .eq('user_id', uid) filter — RLS now returns every trip this
         user is a member of (owned or joined), via is_trip_member(). */
      const { data: rows, error } = await client.from('trips').select('*')
        .order('created_at', { ascending: false });
      if (error) return false;
      /* _ownerId tags who actually owns this trip row — the cached trip
         object (r.data) has no way to know this on its own, and the UI
         needs it to tell an owner's "Delete" from a member's "Leave". */
      const converted = (rows || []).map(r => ({ ...r.data, _ownerId: r.user_id }));
      /* Merge onto (not replace) the existing local list. If a trip is
         ever missing from this query for any reason (an RLS edge case,
         a save that hadn't finished syncing yet, a network blip on a
         previous sync) a plain overwrite would silently and permanently
         wipe it from local storage the next time this runs — it just
         vanishes from "Your Trips" with no error. Keep any locally-known
         trip not present in the fresh result; Supabase's copy wins for
         anything that exists in both. */
      const existingTrips = JSON.parse(localStorage.getItem('pm_trips') || '[]');
      const freshIds = new Set(converted.map(t => t.id));
      const merged = [...converted, ...existingTrips.filter(t => !freshIds.has(t.id))];
      localStorage.setItem('pm_trips', JSON.stringify(merged));
      const cur = JSON.parse(localStorage.getItem('currentTrip') || 'null');
      if (cur) {
        const updated = merged.find(t => t.id === cur.id);
        updated
          ? localStorage.setItem('currentTrip', JSON.stringify(updated))
          : merged.length
            ? localStorage.setItem('currentTrip', JSON.stringify(merged[0]))
            : localStorage.removeItem('currentTrip');
      } else if (merged.length) {
        localStorage.setItem('currentTrip', JSON.stringify(merged[0]));
      }
      return true;
    },

    /* pull pack state from Supabase → update localStorage */
    async syncPackState(tripId) {
      if (_packGuard(tripId).isDirty()) return false;
      const client = await sb(); const uid = _uid();
      if (!client || !uid) return false;
      const { data, error } = await client.from('packing_state').select('*')
        .eq('trip_id', tripId).eq('user_id', uid).maybeSingle();
      if (error || !data) return false;
      /* Merge onto (not replace) the existing local blob. "finished" only
         gets trusted from Supabase once the column actually exists there
         (data.finished !== undefined) — on a project where the migration
         hasn't been applied yet, select('*') simply won't return that key,
         and blindly coercing a missing value to false would silently wipe
         a locally-set "finished" back to unset on every background sync. */
      const existing = JSON.parse(localStorage.getItem(`pm_pack_${tripId}`) || '{}');
      localStorage.setItem(`pm_pack_${tripId}`, JSON.stringify({
        ...existing,
        itemState:   data.item_state   || {},
        dismissed:   data.dismissed    || [],
        customItems: data.custom_items || {},
        finished:    data.finished !== undefined ? !!data.finished : !!existing.finished,
      }));
      return true;
    },

    /* read-only preview of a trip by invite code — safe to call before
       joining (used for joinTrip.html's preview card). Returns null if
       the code doesn't exist or Supabase is unavailable. */
    async previewTripByCode(inviteCode) {
      const client = await sb();
      if (!client) return null;
      const { data, error } = await client.rpc('preview_trip_by_code', { p_invite_code: inviteCode });
      if (error || !data?.length) return null;
      const row = data[0];
      return { destination: row.destination, fromDate: row.from_date, toDate: row.to_date, travelers: row.travelers };
    },

    /* actually join a trip: adds the caller to trip_members server-side
       and returns the full trip object for the client to cache locally. */
    async joinTripByCode(inviteCode) {
      const client = await sb();
      if (!client) return { success: false, error: 'Connection unavailable. Please try again.' };
      const { data, error } = await client.rpc('join_trip_by_code', { p_invite_code: inviteCode });
      if (error || !data) {
        Auth.logError(error?.message || 'join_trip_by_code failed', { where: 'joinTripByCode', inviteCode });
        return { success: false, error: 'Invalid invite code.' };
      }
      const trip = { ...(data.data || data), _ownerId: data.user_id }; // RPC returns the trips row; .data is the full trip object, user_id is the owner
      const trips = JSON.parse(localStorage.getItem('pm_trips') || '[]');
      if (!trips.find(t => t.id === trip.id)) {
        trips.push(trip);
        localStorage.setItem('pm_trips', JSON.stringify(trips));
      }
      localStorage.setItem('currentTrip', JSON.stringify(trip));
      if (!localStorage.getItem(`pm_pack_${trip.id}`)) {
        localStorage.setItem(`pm_pack_${trip.id}`, JSON.stringify({ itemState: {}, dismissed: [], customItems: {} }));
      }
      return { success: true, trip };
    },

    /* real trip-mates (name + avatar only, never full profile PII) —
       replaces the placeholder dots rendered from a plain traveler count */
    async getTripMembers(tripId) {
      const client = await sb();
      if (!client) return [];
      const { data, error } = await client.rpc('get_trip_member_profiles', { p_trip_id: tripId });
      if (error) { console.error('[DB] getTripMembers:', error.message); Auth.logError(error.message, { where: 'getTripMembers' }); return []; }
      return data || [];
    },

    /* real packmates: everyone you've actually shared a trip with */
    async getMyPackmates() {
      const client = await sb();
      if (!client) return [];
      const { data, error } = await client.rpc('get_my_packmates');
      if (error) { console.error('[DB] getMyPackmates:', error.message); Auth.logError(error.message, { where: 'getMyPackmates' }); return []; }
      return data || [];
    },

    /* real, opt-in Community Travelers — only users who turned this on */
    async getDiscoverableTravelers(limit = 12) {
      const client = await sb();
      if (!client) return [];
      const { data, error } = await client.rpc('get_discoverable_travelers', { p_limit: limit });
      if (error) { console.error('[DB] getDiscoverableTravelers:', error.message); Auth.logError(error.message, { where: 'getDiscoverableTravelers' }); return []; }
      return data || [];
    },

    /* owner-only: remove a member from a trip */
    async removeMember(tripId, userId) {
      const client = await sb();
      if (!client) return { success: false, error: 'Connection unavailable.' };
      const { error } = await client.rpc('remove_trip_member', { p_trip_id: tripId, p_user_id: userId });
      if (error) {
        Auth.logError(error.message, { where: 'removeMember', tripId, userId });
        return { success: false, error: error.message.includes('Only the trip owner') ? 'Only the trip owner can remove someone.' : 'Could not remove this member.' };
      }
      return { success: true };
    },

    /* owner-only: add someone already in the caller's real Packmates
       list directly to a trip (see get_my_packmates()) */
    async addPackmateToTrip(tripId, userId) {
      const client = await sb();
      if (!client) return { success: false, error: 'Connection unavailable.' };
      const { error } = await client.rpc('add_packmate_to_trip', { p_trip_id: tripId, p_user_id: userId });
      if (error) {
        Auth.logError(error.message, { where: 'addPackmateToTrip', tripId, userId });
        return { success: false, error: 'Could not add this packmate — you may only add people you\'ve already shared a trip with.' };
      }
      return { success: true };
    },

    /* save profile to localStorage + Supabase */
    async saveProfile(profileData) {
      const merged = { ...JSON.parse(localStorage.getItem('pm_profile') || '{}'), ...profileData };
      localStorage.setItem('pm_profile', JSON.stringify(merged));
      const client = await sb(); const uid = _uid();
      if (!client || !uid) return;
      client.from('profiles').upsert({
        id: uid,
        name:     merged.name    || null, handle:   merged.handle   || null,
        avatar:   merged.avatar  || null, gender:   merged.gender   || null,
        pd_name:  merged.pdName  || null, pd_email: merged.pdEmail  || null,
        pd_phone: merged.pdPhone || null, notif:    merged.notif    || {},
        privacy:  merged.privacy || {}, discoverable: !!merged.discoverable,
        bio:      merged.bio     || null, location: merged.location || null,
      }, { onConflict: 'id' })
        .then(({ error }) => { if (error) { console.error('[DB] saveProfile:', error.message); Auth.logError(error.message, { where: 'saveProfile' }); } });
    },

    /* pull profile from Supabase → update localStorage */
    async syncProfile() {
      const client = await sb(); const uid = _uid();
      if (!client || !uid) return false;
      const { data, error } = await client.from('profiles').select('*').eq('id', uid).maybeSingle();
      if (error || !data) return false;
      const existing = JSON.parse(localStorage.getItem('pm_profile') || '{}');
      localStorage.setItem('pm_profile', JSON.stringify({
        ...existing,
        name:     data.name     || existing.name,
        handle:   data.handle   || existing.handle,
        avatar:   data.avatar   || existing.avatar,
        gender:   data.gender   || existing.gender,
        pdName:   data.pd_name  || existing.pdName,
        pdEmail:  data.pd_email || existing.pdEmail,
        pdPhone:  data.pd_phone || existing.pdPhone,
        notif:    data.notif    || existing.notif,
        privacy:  data.privacy  || existing.privacy,
        discoverable: data.discoverable ?? existing.discoverable ?? false,
        bio:      data.bio      || existing.bio,
        location: data.location || existing.location,
      }));
      return true;
    },
  };
})();

/* ── XSS escaper ─────────────────────────────────────────────────────── */
function escapeHtml(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

/* ── Page transitions ────────────────────────────────────────────────── */
(function () {
  /* Previously this delayed every same-origin navigation by ~175ms via the
     Navigation API's e.intercept(), toggling a .pm-exit class (animation:...
     both!important) to fade the old page out first. In testing that turned out
     to be unreliable across a real cross-document navigation: .pm-exit could
     end up applied to the *new* document (sometimes over a second after it
     loaded), and since nothing but this code ever cleared it, the class's
     animation:...both!important left the page permanently opacity:0 and
     pointer-events:none — a blank, unclickable page with zero console errors.
     Sweeping the class away defensively just traded that for a worse-looking
     failure (Chrome's native view-transition old-page snapshot staying stuck
     on screen on top of the live new page). Also dropped the body{animation:
     pm-in...} entrance fade that used to run alongside this: testing showed
     it can get stuck at its 0%-opacity frame indefinitely (animationPlayState
     stayed "running" for 7+ seconds without ever progressing) on a page that
     arrived via a cross-document view transition. Root cause unconfirmed —
     couldn't rule out a headless-Chromium-only rendering quirk — but the
     failure mode is a permanently invisible page, so it's not worth the risk
     for a 300ms cosmetic fade. @view-transition{navigation:auto} below still
     gives Chrome a native, browser-managed cross-document fade on its own;
     it operates on separate compositor-level snapshots, not the real body's
     own opacity, so it can't leave the actual page invisible. */
  /* The native app is always mobile-width, but it's a known, modern WebKit
     engine (unlike arbitrary mobile browsers), so it doesn't carry the same
     compatibility risk the mobile-web check below is guarding against. */
  const _isNativeApp = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  const _mobile = !_isNativeApp && (window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent));
  /* A synchronized crossfade (old and new both fading over the *same*
     short window) reads as one organic motion. Mismatched old/new
     durations — e.g. old fading out over 180ms while new fades in over
     300ms — instead read as two sequential motions, which is what made
     this feel like a "website" navigating rather than an app switching
     screens. */
  /* Cross-document view transitions are OFF for the native app too (not
     just mobile web). WebKit's ::view-transition-group(root) carries a
     built-in animation that interpolates the captured snapshot's size and
     position between the old and new page, and on this WKWebView build it
     kept warping/tearing the page (a diagonal wedge torn through the hero
     photo) even with the group's own `animation` explicitly disabled —
     that override, which fully stops the morph in Chromium, isn't enough
     here. Rather than keep fighting an engine-specific quirk we can't
     live-debug, we just don't opt in: plain navigation, no crossfade, no
     tearing. The native background-color match (capacitor.config.json)
     and page prefetch (capacitor-nav.js) still do the real work of making
     navigation feel instant rather than like a page reload. */
  const _ts = document.createElement('style');
  _ts.textContent = (_mobile || _isNativeApp)
    ? '@view-transition{navigation:none}'
    : '@view-transition{navigation:auto}' +
      '::view-transition-group(root){animation:none}' +
      '::view-transition-old(root),::view-transition-new(root){animation-duration:150ms;animation-timing-function:ease-out}';
  document.head.appendChild(_ts);
})();
