/**
 * Packmates AI notification engine.
 * Handles: smart trip-aware pushes, top-of-page toast, bell badge.
 * Include after auth.js on every authenticated page.
 */
(function () {
  'use strict';

  // ── Storage ──────────────────────────────────────────────────────
  function _key() {
    try {
      const email = (typeof Auth !== 'undefined' && Auth.getSession?.()?.email)
        || JSON.parse(localStorage.getItem('pm_session') || 'null')?.email;
      return email ? `pm_notifications_${email}` : null;
    } catch { return null; }
  }
  function _load() {
    const k = _key();
    if (!k) return [];
    try { return JSON.parse(localStorage.getItem(k) || '[]'); } catch { return []; }
  }
  function _save(list) {
    const k = _key();
    if (k) localStorage.setItem(k, JSON.stringify(list));
  }

  // ── Push (returns true if genuinely new) ─────────────────────────
  function push(type, text, tripName, dedupId) {
    const list = _load();
    if (dedupId && list.some(n => n.dedupId === dedupId)) return false;
    list.unshift({
      id:       Date.now() + Math.floor(Math.random() * 999),
      dedupId:  dedupId || null,
      type, text, tripName,
      time:     new Date().toISOString(),
      read:     false,
    });
    _save(list);
    return true;
  }

  // ── Unread count ─────────────────────────────────────────────────
  function unreadCount() { return _load().filter(n => !n.read).length; }

  // ── Bell badge — intentionally no-op (badge removed per design) ──
  function updateBell() {}

  // ── Toast ────────────────────────────────────────────────────────
  let _toastTimer = null;

  function _injectStyles() {
    if (document.getElementById('pm-notify-css')) return;
    const el = document.createElement('style');
    el.id = 'pm-notify-css';
    el.textContent = `
      /* ── Toast ── */
      .pm-toast {
        position: fixed;
        top: -100px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 99998;
        background: #192919;
        border: 1px solid rgba(95,157,48,0.30);
        border-radius: 18px;
        padding: 13px 16px 13px 14px;
        display: flex;
        align-items: center;
        gap: 12px;
        width: min(calc(100vw - 32px), 400px);
        box-shadow: 0 12px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(95,157,48,0.10);
        transition: top 0.42s cubic-bezier(0.34,1.42,0.64,1), opacity 0.3s ease;
        opacity: 0;
        pointer-events: none;
        user-select: none;
      }
      .pm-toast.pm-toast--visible {
        top: calc(16px + env(safe-area-inset-top));
        opacity: 1;
        pointer-events: auto;
      }

      .pm-toast-icon {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .pm-toast-icon svg {
        width: 17px; height: 17px;
        fill: none;
        stroke-width: 2.2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
      /* colour variants */
      .pm-ti-green  { background: rgba(95,157,48,0.20); }
      .pm-ti-green  svg { stroke: #8be05a; }
      .pm-ti-orange { background: rgba(230,126,34,0.20); }
      .pm-ti-orange svg { stroke: #f39c12; }
      .pm-ti-blue   { background: rgba(74,144,217,0.20); }
      .pm-ti-blue   svg { stroke: #6ab4f5; }
      .pm-ti-purple { background: rgba(155,89,182,0.20); }
      .pm-ti-purple svg { stroke: #c39bd3; }

      .pm-toast-body {
        flex: 1;
        min-width: 0;
      }
      .pm-toast-label {
        font-size: 0.66rem;
        font-weight: 700;
        letter-spacing: 0.07em;
        text-transform: uppercase;
        margin-bottom: 2px;
        opacity: 0.7;
      }
      .pm-ti-green  ~ .pm-toast-body .pm-toast-label { color: #8be05a; }
      .pm-ti-orange ~ .pm-toast-body .pm-toast-label { color: #f39c12; }
      .pm-ti-blue   ~ .pm-toast-body .pm-toast-label { color: #6ab4f5; }
      .pm-ti-purple ~ .pm-toast-body .pm-toast-label { color: #c39bd3; }

      .pm-toast-text {
        font-size: 0.85rem;
        font-weight: 500;
        color: rgba(255,255,255,0.88);
        line-height: 1.35;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .pm-toast-close {
        background: none;
        border: none;
        color: rgba(255,255,255,0.35);
        cursor: pointer;
        padding: 5px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        transition: color 0.15s;
        flex-shrink: 0;
      }
      .pm-toast-close:hover { color: rgba(255,255,255,0.75); }
    `;
    document.head.appendChild(el);
  }

  const _ICONS = {
    packing:  { cls: 'pm-ti-green',  svg: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>',   label: 'Pack Up' },
    reminder: { cls: 'pm-ti-blue',   svg: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',                             label: 'Reminder' },
    alert:    { cls: 'pm-ti-orange', svg: '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>', label: 'Heads Up' },
    trip:     { cls: 'pm-ti-green',  svg: '<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>', label: 'Trip' },
    join:     { cls: 'pm-ti-purple', svg: '<path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>', label: 'Joined' },
    social:   { cls: 'pm-ti-purple', svg: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>', label: 'Packmate' },
  };

  function showToast(text, type, tripName) {
    if (location.pathname.endsWith('notifications.html')) return;
    _injectStyles();

    let toast = document.getElementById('pm-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'pm-toast';
      toast.className = 'pm-toast';
      document.body.appendChild(toast);
    }

    const meta = _ICONS[type] || _ICONS.packing;
    const full = tripName ? `${text} — ${tripName}` : text;

    toast.innerHTML = `
      <div class="pm-toast-icon ${meta.cls}">
        <svg viewBox="0 0 24 24">${meta.svg}</svg>
      </div>
      <div class="pm-toast-body">
        <div class="pm-toast-label">${meta.label}</div>
        <div class="pm-toast-text" title="${full}">${full}</div>
      </div>
      <button class="pm-toast-close" aria-label="Dismiss"
        onclick="document.getElementById('pm-toast').classList.remove('pm-toast--visible')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>`;

    clearTimeout(_toastTimer);
    // Force reflow so transition triggers even if already visible
    toast.classList.remove('pm-toast--visible');
    void toast.offsetWidth;
    requestAnimationFrame(() => {
      toast.classList.add('pm-toast--visible');
      _toastTimer = setTimeout(() => toast.classList.remove('pm-toast--visible'), 5500);
    });
  }

  // ── Smart trip-context notifications ─────────────────────────────
  function checkTrip() {
    try {
      const trip = JSON.parse(localStorage.getItem('currentTrip') || 'null');
      if (!trip?.id || !trip?.destination || !trip?.fromDate) return;

      const dest  = trip.destination;
      const id    = trip.id;
      const now   = Date.now();
      const start = new Date(trip.fromDate).getTime();
      const days  = Math.round((start - now) / 86400000);

      // Pack progress
      const packRaw = JSON.parse(localStorage.getItem(`pm_pack_${id}`) || '{}');
      const items   = Object.values(packRaw.itemState || {});
      const packed  = items.filter(v => v?.packed).length;
      /* itemState only ever contains items someone has actually clicked,
         not every suggested item — using its own length as the total
         means checking even 1 of 40 suggested items reads as "100%
         packed". packing-list.js/tripPreview.html persist the real
         suggested count as totalSuggested for exactly this reason. */
      const total   = packRaw.totalSuggested || items.length;
      const pct     = total > 0 ? Math.round(packed / total * 100) : -1;

      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

      let newNotif = null;

      // ── Countdown milestones ──
      if (days === 14) {
        if (push('reminder', `Two weeks until your trip to ${dest}! Time to build your packing list.`, dest, `${id}_14d`))
          newNotif = { type: 'reminder', text: `Two weeks until ${dest}! Time to build your packing list.` };
      } else if (days === 7) {
        if (push('reminder', `One week until ${dest}! Don't forget to start packing.`, dest, `${id}_7d`))
          newNotif = { type: 'reminder', text: `One week until ${dest}! Don't forget to start packing.` };
      } else if (days === 3) {
        if (push('alert', `Only 3 days until ${dest} — start packing now!`, dest, `${id}_3d`))
          newNotif = { type: 'alert', text: `Only 3 days until ${dest} — start packing now!` };
      } else if (days === 2) {
        if (push('alert', `2 days to go! Make sure your bags are ready for ${dest}.`, dest, `${id}_2d`))
          newNotif = { type: 'alert', text: `2 days to go! Make sure your bags are ready for ${dest}.` };
      } else if (days === 1) {
        if (push('alert', `Tomorrow is the big day! Final packing check for ${dest}.`, dest, `${id}_1d`))
          newNotif = { type: 'alert', text: `Tomorrow is the big day! Final check for ${dest}.` };
      } else if (days === 0) {
        if (push('trip', `Your trip to ${dest} starts today! Safe travels ✈️`, dest, `${id}_d0`))
          newNotif = { type: 'trip', text: `Your trip to ${dest} starts today! Safe travels ✈️` };
      }

      // ── Packing progress nudge — within 7 days, below 40% packed ──
      if (!newNotif && days > 0 && days <= 7 && pct >= 0 && pct < 40) {
        const dedupKey = `${id}_nudge_${today}`;
        const msg = pct === 0
          ? `Start packing for ${dest}! Only ${days} day${days !== 1 ? 's' : ''} left.`
          : `You've packed ${pct}% for ${dest}. Only ${days} day${days !== 1 ? 's' : ''} to go!`;
        if (push('packing', msg, dest, dedupKey))
          newNotif = { type: 'packing', text: msg };
      }

      // ── Milestones (50% and 100%) ── once per milestone
      if (!newNotif && pct === 100 && days > 0) {
        if (push('packing', `You're all packed for ${dest}! Ready to go 🎒`, dest, `${id}_100pct`))
          newNotif = { type: 'packing', text: `You're all packed for ${dest}! Ready to go 🎒` };
      } else if (!newNotif && pct >= 50 && pct < 100 && days > 0) {
        if (push('packing', `Halfway there! You've packed 50% for ${dest}. Keep it up!`, dest, `${id}_50pct`))
          newNotif = { type: 'packing', text: `Halfway there! You've packed 50% for ${dest}.` };
      }

      // ── General "still not packed" reminder — fires roughly every 1-2
      // days regardless of how far out the trip is (the countdown/nudge
      // checks above are more specific and take priority; this is the
      // catch-all for everything in between). Gated by a real elapsed-
      // time check rather than a per-day dedup key, since "once a day"
      // and "every day or two" aren't the same cadence. ──
      if (!newNotif && days > 0 && pct >= 0 && pct < 100) {
        const lastKey = `pm_packreminder_${id}`;
        const lastShown = parseInt(localStorage.getItem(lastKey) || '0', 10);
        const hoursSince = (now - lastShown) / 3600000;
        if (hoursSince >= 36) {
          const msg = pct === 0
            ? `You haven't started packing for ${dest} yet — ${days} day${days !== 1 ? 's' : ''} to go.`
            : `Still ${100 - pct}% left to pack for ${dest}. Pick up where you left off!`;
          if (push('reminder', msg, dest, `${id}_stillpacking_${now}`)) {
            newNotif = { type: 'reminder', text: msg };
            localStorage.setItem(lastKey, String(now));
          }
        }
      }

      if (newNotif) showToast(newNotif.text, newNotif.type, '');
    } catch (e) {}
  }

  // ── Bot social notifications ──────────────────────────────────────
  const _BOT_TRAVELERS = [
    { name:'Sofia Martinez',   dests:['Santorini','Havana','Lisbon','Marrakech','Kyoto'] },
    { name:'James Richardson', dests:['Tokyo','Iceland','Morocco','Sri Lanka','Patagonia'] },
    { name:'Aiko Tanaka',      dests:['Bali','Seoul','Chiang Mai','Kyoto','Reykjavik'] },
    { name:'Carlos Vega',      dests:['Nepal','Tanzania','Colombia','Cuba','Georgia'] },
    { name:'Emma Laurent',     dests:['Florence','Amsterdam','Copenhagen','Buenos Aires','New Orleans'] },
    { name:'Noah Kim',         dests:['Maldives','Hawaii','Fiji','Azores','Great Barrier Reef'] },
    { name:'Priya Sharma',     dests:['Rajasthan','Bhutan','Vietnam','Jordan','Portugal'] },
    { name:'Liam Brooks',      dests:['Banff','Patagonia','Norwegian Fjords','New Zealand','Yellowstone'] },
  ];
  const _BOT_TEMPLATES = [
    (n,d) => `<strong>${n}</strong> just added a packing list for ${d}!`,
    (n,d) => `<strong>${n}</strong> completed their trip to ${d} 🎒`,
    (n,d) => `<strong>${n}</strong> is planning a trip to ${d} — want to join?`,
    (n,d) => `<strong>${n}</strong> just landed in ${d} ✈️`,
    (n,d) => `<strong>${n}</strong> packed for ${d} in record time! 🧳`,
    (n,d) => `Your packmate <strong>${n}</strong> is heading to ${d} next week!`,
    (n,d) => `<strong>${n}</strong> discovered a hidden gem in ${d}!`,
    (n,d) => `<strong>${n}</strong> checked off all items for their ${d} trip!`,
    (n,d) => `<strong>${n}</strong> posted a new update from ${d}`,
    (n,d) => `<strong>${n}</strong> shared a packing tip from ${d}!`,
  ];

  function checkBotNotifs() {
    try {
      if (!_key()) return;
      const today = new Date().toISOString().slice(0, 10);
      const dedupKey = 'bot_daily_' + today;
      if (_load().some(n => n.dedupId === dedupKey)) return;
      const rng = (n) => Math.floor(Math.random() * n);
      const bot  = _BOT_TRAVELERS[rng(_BOT_TRAVELERS.length)];
      const dest = bot.dests[rng(bot.dests.length)];
      const tpl  = _BOT_TEMPLATES[rng(_BOT_TEMPLATES.length)];
      const html = tpl(bot.name, dest);
      const plain = html.replace(/<[^>]+>/g, '');
      push('social', html, '', dedupKey);
      setTimeout(() => showToast(plain, 'social', ''), 3000);
    } catch(e) {}
  }

  // ── Real social notifications: trip_members inserts/deletes ────────
  // Runs alongside the bot notifications above rather than replacing
  // them — these are the genuinely real-user-triggered social events in
  // the notification feed. Three cases share one channel:
  //   1. Someone else joined a trip I'm already on ("X joined your trip")
  //   2. I was added to a trip by its owner ("X added you to a trip") —
  //      distinguished from my OWN join_trip_by_code() call via
  //      added_by (self for a voluntary join, the owner's id otherwise)
  //      so this doesn't fire a redundant toast right after I join
  //      myself.
  //   3. I was removed from a trip — also cleans up the now-stale local
  //      cache so the trip doesn't linger in the list.
  async function _initRealSocialEvents() {
    try {
      if (typeof window._pm_sbLoaded === 'undefined' || typeof Auth === 'undefined') return;
      const sbClient = await window._pm_sbLoaded;
      if (!sbClient) return;
      const session = Auth.getSession();
      if (!session) return;
      const myUserId = (() => { try { return JSON.parse(localStorage.getItem('sb-ocwqpeyfxsovkqbmzlgh-auth-token'))?.user?.id; } catch { return null; } })();
      if (!myUserId) return;

      sbClient.channel('trip-members-notify')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'trip_members' }, async payload => {
          const row = payload.new;
          if (!row) return;

          if (row.user_id === myUserId) {
            // Someone else added me — as opposed to my own voluntary join,
            // where added_by === myUserId and there's nothing to announce.
            if (!row.added_by || row.added_by === myUserId) return;
            const [members, tripRes] = await Promise.all([
              DB.getTripMembers(row.trip_id),
              sbClient.from('trips').select('data').eq('id', row.trip_id).maybeSingle(),
            ]);
            const adder = members.find(m => m.user_id === row.added_by);
            const name = adder?.name || 'A packmate';
            const dest = tripRes?.data?.data?.destination || 'a trip';
            const text = `<strong>${name}</strong> added you to their trip to ${dest}! 🎒`;
            if (push('join', text, dest, `real_added_${row.trip_id}_${myUserId}`)) {
              showToast(`${name} added you to their trip to ${dest}!`, 'join', dest);
            }
            return;
          }

          const myTrips = (() => { try { return JSON.parse(localStorage.getItem('pm_trips') || '[]'); } catch { return []; } })();
          const trip = myTrips.find(t => t.id === row.trip_id);
          if (!trip) return; // not a trip I have cached — likely not mine

          const members = await DB.getTripMembers(row.trip_id);
          const joiner = members.find(m => m.user_id === row.user_id);
          const name = joiner?.name || 'Someone';
          const dest = trip.destination || 'your trip';
          const text = `<strong>${name}</strong> joined your trip to ${dest}! 🎒`;
          if (push('join', text, dest, `real_join_${row.trip_id}_${row.user_id}`)) {
            showToast(`${name} joined your trip to ${dest}!`, 'join', dest);
          }
        })
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'trip_members' }, payload => {
          const row = payload.old;
          if (!row || row.user_id !== myUserId) return; // only care about my own removal

          const myTrips = (() => { try { return JSON.parse(localStorage.getItem('pm_trips') || '[]'); } catch { return []; } })();
          const trip = myTrips.find(t => t.id === row.trip_id);
          const dest = trip?.destination || 'a trip';

          try {
            const remaining = myTrips.filter(t => t.id !== row.trip_id);
            localStorage.setItem('pm_trips', JSON.stringify(remaining));
            const current = JSON.parse(localStorage.getItem('currentTrip') || 'null');
            if (current?.id === row.trip_id) localStorage.removeItem('currentTrip');
          } catch {}

          const text = `You were removed from the trip to <strong>${dest}</strong>.`;
          if (push('alert', text, dest, `real_removed_${row.trip_id}_${myUserId}`)) {
            showToast(`You were removed from the trip to ${dest}.`, 'alert', dest);
          }
        })
        .subscribe();
    } catch(e) {}
  }

  // ── Catch-up: real events missed while this browser wasn't open ────
  // The Realtime listener above only fires while a page is actively
  // subscribed — if you were added or removed while offline, you'd
  // never hear about it and (for removal) the trip would just quietly
  // vanish next time you looked, with no explanation. Runs once per
  // page load; cheap, since both queries filter to rows where
  // user_id = me and RLS already scopes the select to that.
  async function _catchUpMissedEvents() {
    try {
      if (typeof window._pm_sbLoaded === 'undefined' || typeof Auth === 'undefined') return;
      const sbClient = await window._pm_sbLoaded;
      if (!sbClient) return;
      const session = Auth.getSession();
      if (!session) return;
      const myUserId = (() => { try { return JSON.parse(localStorage.getItem('sb-ocwqpeyfxsovkqbmzlgh-auth-token'))?.user?.id; } catch { return null; } })();
      if (!myUserId) return;

      const lastCheckKey = 'pm_notif_lastcheck_' + myUserId;
      const lastCheck = localStorage.getItem(lastCheckKey) || new Date(Date.now() - 7 * 86400000).toISOString();
      const nowIso = new Date().toISOString();

      // ── Trips I was added to by someone else since I last checked ──
      const { data: added } = await sbClient
        .from('trip_members')
        .select('trip_id, added_by, joined_at')
        .eq('user_id', myUserId)
        .neq('added_by', myUserId)
        .gt('joined_at', lastCheck);

      for (const row of (added || [])) {
        const [members, tripRes] = await Promise.all([
          DB.getTripMembers(row.trip_id),
          sbClient.from('trips').select('data').eq('id', row.trip_id).maybeSingle(),
        ]);
        const adder = members.find(m => m.user_id === row.added_by);
        const name = adder?.name || 'A packmate';
        const dest = tripRes?.data?.data?.destination || 'a trip';
        push('join', `<strong>${name}</strong> added you to their trip to ${dest}! 🎒`, dest, `real_added_${row.trip_id}_${myUserId}`);
      }

      // ── Trips I had cached that I'm silently no longer a member of ──
      const myTrips = (() => { try { return JSON.parse(localStorage.getItem('pm_trips') || '[]'); } catch { return []; } })();
      if (myTrips.length) {
        const { data: stillMember } = await sbClient.from('trip_members').select('trip_id').eq('user_id', myUserId);
        const stillIds = new Set((stillMember || []).map(r => r.trip_id));
        const goneMissing = myTrips.filter(t => !stillIds.has(t.id));

        if (goneMissing.length) {
          goneMissing.forEach(t => {
            const dest = t.destination || 'a trip';
            push('alert', `You were removed from the trip to <strong>${dest}</strong>.`, dest, `real_removed_${t.id}_${myUserId}`);
          });
          localStorage.setItem('pm_trips', JSON.stringify(myTrips.filter(t => stillIds.has(t.id))));
          const current = JSON.parse(localStorage.getItem('currentTrip') || 'null');
          if (current && !stillIds.has(current.id)) localStorage.removeItem('currentTrip');
        }
      }

      localStorage.setItem(lastCheckKey, nowIso);
    } catch (e) {}
  }

  // ── Init ─────────────────────────────────────────────────────────
  function init() {
    _injectStyles();
    checkTrip();
    checkBotNotifs();
    _initRealSocialEvents();
    _catchUpMissedEvents();
    // Bell badge runs after a tick so DOM is fully rendered
    setTimeout(updateBell, 0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ── Public API ───────────────────────────────────────────────────
  window.Notify = { push, showToast, unreadCount, updateBell, checkTrip };
})();
