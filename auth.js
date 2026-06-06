/**
 * Packmates — client-side auth using localStorage.
 * Users are stored as: pm_users = [ { name, email, pwHash } ]
 * Session:             pm_session = { email, name }
 */
const Auth = (() => {
  const USERS_KEY   = 'pm_users';
  const SESSION_KEY = 'pm_session';
  const SAVED_KEY   = 'pm_saved_email';

  /* ── Tiny hash (djb2) — good enough for a local demo ── */
  function hash(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i);
    return (h >>> 0).toString(36);
  }

  function getUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
    catch { return []; }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  return {
    /* ── Register ── */
    register(name, email, pw) {
      const users = getUsers();
      const norm  = email.trim().toLowerCase();

      if (!name.trim())        return { success: false, error: 'Please enter your name.' };
      if (!norm.includes('@')) return { success: false, error: 'Please enter a valid email.' };
      if (pw.length < 8)       return { success: false, error: 'Password must be at least 8 characters.' };

      if (users.find(u => u.email === norm)) {
        return { success: false, error: 'An account with this email already exists.' };
      }

      users.push({ name: name.trim(), email: norm, pwHash: hash(pw) });
      saveUsers(users);

      /* auto sign-in after registration */
      localStorage.setItem(SESSION_KEY, JSON.stringify({ email: norm, name: name.trim() }));
      return { success: true };
    },

    /* ── Login ── */
    login(email, pw, remember = false) {
      const norm  = email.trim().toLowerCase();
      const users = getUsers();
      const user  = users.find(u => u.email === norm);

      if (!user)                      return { success: false, error: 'No account found with this email.' };
      if (user.pwHash !== hash(pw))   return { success: false, error: 'Incorrect password. Please try again.' };

      localStorage.setItem(SESSION_KEY, JSON.stringify({ email: norm, name: user.name }));

      if (remember) localStorage.setItem(SAVED_KEY, norm);
      else          localStorage.removeItem(SAVED_KEY);

      return { success: true };
    },

    /* ── Logout ── */
    logout() {
      localStorage.removeItem(SESSION_KEY);
    },

    /* ── Get current session ── */
    getSession() {
      try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }
      catch { return null; }
    },

    /* ── Is authenticated ── */
    isLoggedIn() {
      return !!this.getSession();
    },

    /* ── Require auth — redirect if not logged in ── */
    requireAuth(redirectTo = 'welcome.html') {
      if (!this.isLoggedIn()) {
        location.replace(redirectTo);
        return false;
      }
      return true;
    },

    /* ── Saved email for "remember me" ── */
    getSavedEmail() {
      return localStorage.getItem(SAVED_KEY) || '';
    },
  };
})();
