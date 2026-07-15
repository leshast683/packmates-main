/**
 * Packmates — Auth layer: Supabase backend + localStorage fallback for existing users.
 * New users  → Supabase Auth (PostgreSQL).
 * Old users  → verified locally, then auto-migrated to Supabase on first login.
 */

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
            location.replace('login.html?expired=1');
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
      /* Profile row is auto-created by the DB trigger */
      return { success: true };
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
      /* Block Supabase users whose email is not yet confirmed */
      const sbUser = _sbCachedUser();
      if (sbUser && !sbUser.email_confirmed_at) {
        this.logout();
        location.replace(redirect);
        return false;
      }
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

    /* delete trip from localStorage + Supabase */
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
      if (client && uid) {
        /* Try an owner-delete first — RLS only allows this to affect a row
           if the caller owns it, so .select('id') tells us whether it
           actually happened. If it didn't (0 rows), the caller is a
           member who joined someone else's trip: "delete" means "leave"
           for them instead — drop their own membership + pack state,
           leave the trip itself intact for the owner and other members. */
        client.from('trips').delete().eq('id', tripId).select('id')
          .then(({ data: deletedRows, error }) => {
            if (error) {
              console.error('[DB] deleteTrip:', error.message);
              Auth.logError(error.message, { where: 'deleteTrip' });
              return;
            }
            _tripsGuard.clear();
            if (deletedRows?.length) {
              client.from('packing_state').delete().eq('trip_id', tripId).eq('user_id', uid)
                .then(({ error }) => { if (error) { console.error('[DB] deletePackState:', error.message); Auth.logError(error.message, { where: 'deletePackState' }); } });
            } else {
              client.from('trip_members').delete().eq('trip_id', tripId).eq('user_id', uid)
                .then(({ error }) => { if (error) { console.error('[DB] leaveTrip:', error.message); Auth.logError(error.message, { where: 'leaveTrip' }); } });
              client.from('packing_state').delete().eq('trip_id', tripId).eq('user_id', uid)
                .then(({ error }) => { if (error) { console.error('[DB] leaveTrip packState:', error.message); Auth.logError(error.message, { where: 'leaveTrip packState' }); } });
            }
          });
      }
    },

    /* save packing state to localStorage + Supabase (debounced) */
    savePackState(tripId, state) {
      localStorage.setItem(`pm_pack_${tripId}`, JSON.stringify(state));
      _packGuard(tripId).markDirty();
      _debounce('pack_' + tripId, async () => {
        const client = await sb(); const uid = _uid();
        if (!client || !uid) return;
        client.from('packing_state').upsert({
          trip_id: tripId, user_id: uid,
          item_state:   state.itemState   || {},
          dismissed:    state.dismissed   || [],
          custom_items: state.customItems || {},
        }, { onConflict: 'trip_id,user_id' })
          .then(({ error }) => {
            if (error) { console.error('[DB] savePackState:', error.message); Auth.logError(error.message, { where: 'savePackState' }); }
            else { _packGuard(tripId).clear(); }
          });
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
      localStorage.setItem('pm_trips', JSON.stringify(converted));
      const cur = JSON.parse(localStorage.getItem('currentTrip') || 'null');
      if (cur) {
        const updated = converted.find(t => t.id === cur.id);
        updated
          ? localStorage.setItem('currentTrip', JSON.stringify(updated))
          : converted.length
            ? localStorage.setItem('currentTrip', JSON.stringify(converted[0]))
            : localStorage.removeItem('currentTrip');
      } else if (converted.length) {
        localStorage.setItem('currentTrip', JSON.stringify(converted[0]));
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
      localStorage.setItem(`pm_pack_${tripId}`, JSON.stringify({
        itemState:   data.item_state   || {},
        dismissed:   data.dismissed    || [],
        customItems: data.custom_items || {},
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
  const _mobile = window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent);
  const _ts = document.createElement('style');
  if (_mobile) {
    _ts.textContent =
      '@view-transition{navigation:none}' +
      'body{animation:none!important}' +
      '.pm-exit{animation:none!important;pointer-events:none!important}';
  } else {
    _ts.textContent =
      '@view-transition{navigation:auto}' +
      '@keyframes pm-in{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}' +
      '@keyframes pm-out{to{opacity:0;transform:translateY(-5px) scale(.99)}}' +
      '::view-transition-old(root){animation:180ms ease-out both pm-out}' +
      '::view-transition-new(root){animation:300ms cubic-bezier(0,0,.2,1) both pm-in}' +
      'body{animation:pm-in 300ms cubic-bezier(0,0,.2,1) both}' +
      '.pm-exit{animation:pm-out 180ms ease-out both!important;pointer-events:none!important}';
  }
  document.head.appendChild(_ts);
  if (window.navigation && typeof window.navigation.addEventListener === 'function') {
    window.navigation.addEventListener('navigate', function(e) {
      if (!e.canIntercept || e.hashChange || e.downloadRequest != null) return;
      if (e.navigationType === 'reload') return;
      try { if (new URL(e.destination.url).origin !== location.origin) return; } catch { return; }
      if (_mobile) return;
      e.intercept({ handler: () => new Promise(r => { document.body.classList.add('pm-exit'); setTimeout(r, 175); }) });
    });
    return;
  }
  document.addEventListener('click', function(e) {
    const a = e.target.closest('a[href]');
    if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const href = a.getAttribute('href');
    if (!href || /^(#|javascript:|mailto:|tel:)/.test(href)) return;
    if (_mobile) return;
    e.preventDefault();
    document.body.classList.add('pm-exit');
    setTimeout(() => { location.href = a.href; }, 180);
  }, true);
})();
