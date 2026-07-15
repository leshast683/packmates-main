/**
 * Shared sidebar nav + sign-out confirmation, injected into every app page.
 * Usage: <nav class="sidebar" data-page="profile.html"></nav><script src="nav.js"></script>
 */
(function () {
  const NAV_ITEMS = [
    { page: 'index.html', label: 'Home',
      icon: '<path d="M3 9L12 2l9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>' },
    { page: 'discover.html', label: 'Discover',
      icon: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>' },
    { page: 'packing-list.html', label: 'Packing List',
      icon: '<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/>' },
    { page: 'notifications.html', label: 'Notifications',
      icon: '<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>' },
    { page: 'profile.html', label: 'Profile',
      icon: '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>' },
  ];

  function renderNav(activePage) {
    const buttons = NAV_ITEMS.map(item =>
      `<button type="button" onclick="location.href='${item.page}'"${item.page === activePage ? ' class="active"' : ''}>
        <svg class="nav-icon" viewBox="0 0 24 24">${item.icon}</svg>
        <span>${item.label}</span>
      </button>`
    ).join('');

    return `
      <div class="brand">
        <img src="img/appIcon.png" alt="Packmates AI" class="icon">
        <span>Packmates AI</span>
      </div>
      <span class="nav-label">Main Menu</span>
      <div class="nav-buttons">${buttons}</div>
      <div class="nav-bottom">
        <button type="button" class="nav-new-trip" onclick="location.href='newTrip.html'">
          <svg class="nav-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          <span>New Trip</span>
        </button>
        <button class="logout" type="button" onclick="openLogoutModal()">
          <svg class="nav-icon" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          <span>Sign Out</span>
        </button>
      </div>`;
  }

  const LOGOUT_MODAL_HTML = `
    <div class="modal-overlay" id="logout-modal">
      <div class="modal">
        <div class="modal-icon"><svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></div>
        <h2>Sign out?</h2>
        <p>You'll need to sign back in to access your packing lists and settings.</p>
        <div class="modal-actions">
          <button class="btn-cancel" onclick="closeLogoutModal()">Stay</button>
          <button class="btn-confirm-logout" onclick="confirmLogout()">Sign Out</button>
        </div>
      </div>
    </div>`;

  const nav = document.querySelector('nav.sidebar[data-page]');
  if (nav) nav.innerHTML = renderNav(nav.dataset.page);

  if (!document.getElementById('logout-modal')) {
    document.body.insertAdjacentHTML('beforeend', LOGOUT_MODAL_HTML);
  }

  /* Pages with their own richer confirmLogout (e.g. profile.html's toast)
     declare their own function later in the document, which simply
     overrides this default — no conflict. */
  window.openLogoutModal  = function () { document.getElementById('logout-modal').classList.add('active'); };
  window.closeLogoutModal = function () { document.getElementById('logout-modal').classList.remove('active'); };
  window.confirmLogout    = function () {
    closeLogoutModal();
    setTimeout(() => { Auth.logout(); location.href = 'welcome.html'; }, 200);
  };
})();
