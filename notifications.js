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

  // ── Settings (Profile > Notifications toggles) ────────────────────
  function _notifSettings() {
    try { return JSON.parse(localStorage.getItem('pm_profile') || '{}').notif || {}; } catch { return {}; }
  }

  // ── Push (returns true if genuinely new) ─────────────────────────
  // Respects the "Push Notifications" master toggle in Profile >
  // Notifications (Settings > Notifications > Push Notifications,
  // "In-app alerts") - same default (off) as that toggle's own UI.
  function push(type, text, tripName, dedupId) {
    if (_notifSettings().push === false) return false; // undefined/true = on (default)
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
      /* ── Toast ──
         Card anatomy modeled on the app's notification-card mockup: a
         pastel-tinted 3D-style icon square, bold title + lighter subtitle,
         a small time stamp in the top-right corner, and a large faint
         "travel stamp" echo of the icon bottom-right for texture. */
      .pm-toast {
        position: fixed;
        top: -140px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 99998;
        background: rgba(255,255,255,0.92);
        border: 1px solid rgba(255,255,255,0.6);
        border-radius: 20px;
        padding: 14px 16px;
        display: flex;
        align-items: flex-start;
        gap: 12px;
        width: min(calc(100vw - 32px), 400px);
        box-shadow: 0 16px 40px rgba(13,51,71,0.22), 0 0 0 1px rgba(13,51,71,0.04);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        transition: top 0.42s cubic-bezier(0.34,1.42,0.64,1), opacity 0.3s ease;
        opacity: 0;
        pointer-events: none;
        user-select: none;
        overflow: hidden;
      }
      .pm-toast.pm-toast--visible {
        top: calc(16px + env(safe-area-inset-top));
        opacity: 1;
        pointer-events: auto;
      }

      .pm-toast-icon {
        width: 42px;
        height: 42px;
        border-radius: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        font-size: 1.3rem;
        box-shadow: inset 0 0 0 1px rgba(13,51,71,0.05);
        position: relative;
        z-index: 1;
      }
      /* colour variants (soft pastel tint behind the emoji) */
      .pm-ti-green  { background: rgba(95,157,48,0.15); }
      .pm-ti-orange { background: rgba(230,126,34,0.15); }
      .pm-ti-blue   { background: rgba(74,144,217,0.15); }
      .pm-ti-purple { background: rgba(155,89,182,0.15); }
      .pm-ti-amber  { background: rgba(217,164,6,0.16); }

      .pm-toast-body {
        flex: 1;
        min-width: 0;
        position: relative;
        z-index: 1;
      }
      .pm-toast-top-row {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 10px;
      }
      .pm-toast-label {
        font-size: 0.9rem;
        font-weight: 700;
        color: var(--navy-deep, #0d3347);
        line-height: 1.25;
      }
      .pm-toast-time {
        font-size: 0.66rem;
        font-weight: 600;
        color: rgba(13,51,71,0.38);
        white-space: nowrap;
        flex-shrink: 0;
        margin-top: 1px;
      }

      .pm-toast-text {
        font-size: 0.78rem;
        font-weight: 500;
        color: rgba(13,51,71,0.6);
        line-height: 1.35;
        margin-top: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .pm-toast-close {
        background: none;
        border: none;
        color: rgba(13,51,71,0.3);
        cursor: pointer;
        padding: 5px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        transition: color 0.15s;
        flex-shrink: 0;
        position: relative;
        z-index: 1;
      }
      .pm-toast-close:hover { color: rgba(13,51,71,0.6); }

      /* Decorative "travel stamp" - large faint icon echo, bottom-right,
         behind the text (z-index below .pm-toast-body/.pm-toast-close). */
      .pm-toast-stamp {
        position: absolute;
        right: -14px;
        bottom: -22px;
        width: 84px;
        height: 84px;
        border-radius: 50%;
        border: 1.5px dashed rgba(13,51,71,0.12);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.1rem;
        opacity: 0.14;
        pointer-events: none;
        z-index: 0;
      }
    `;
    document.head.appendChild(el);
  }

  const _ICONS = {
    packing:     { cls: 'pm-ti-green',  emoji: '🎒', label: 'Pack Up' },
    reminder:    { cls: 'pm-ti-blue',   emoji: '⏰', label: 'Reminder' },
    alert:       { cls: 'pm-ti-orange', emoji: '⚠️', label: 'Heads Up' },
    trip:        { cls: 'pm-ti-green',  emoji: '✈️', label: 'Trip' },
    join:        { cls: 'pm-ti-purple', emoji: '👥', label: 'Joined' },
    social:      { cls: 'pm-ti-purple', emoji: '👥', label: 'Packmate' },
    achievement: { cls: 'pm-ti-amber',  emoji: '🏆', label: 'Level Up!' },
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
      <div class="pm-toast-stamp">${meta.emoji}</div>
      <div class="pm-toast-icon ${meta.cls}">${meta.emoji}</div>
      <div class="pm-toast-body">
        <div class="pm-toast-top-row">
          <div class="pm-toast-label">${meta.label}</div>
          <div class="pm-toast-time">now</div>
        </div>
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
  // Everything this generates (countdown milestones, packing-progress
  // nudges, "still not packed" reminders) is what Settings > Notifications
  // > "Packing Reminders" describes, so it's gated on that toggle
  // specifically, on top of push()'s own master "Push Notifications" gate.
  function checkTrip() {
    try {
      if (_notifSettings().reminders === false) return; // undefined/true = on (default)
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

          // Cleans up the now-stale local cache so the trip doesn't linger
          // in the list - no notification for this one, per product
          // decision (the trip just quietly disappears).
          try {
            const remaining = myTrips.filter(t => t.id !== row.trip_id);
            localStorage.setItem('pm_trips', JSON.stringify(remaining));
            const current = JSON.parse(localStorage.getItem('currentTrip') || 'null');
            if (current?.id === row.trip_id) localStorage.removeItem('currentTrip');
          } catch {}
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
          // No notification for these, per product decision - just clean
          // up the stale local cache so removed trips quietly disappear.
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
