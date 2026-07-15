    /* ── Auth guard ── */
    Auth.requireAuth('welcome.html');

    /* ── Custom confirm modal — replaces the plain OS confirm() dialog with
       one that matches the app's own design. A DOM-based modal like this
       has no "user activation" lifetime the way window.confirm() does, so
       it's also just more robust than the native dialog, not only nicer
       looking. */
    function showConfirmModal({ title, message, okLabel = 'Delete', danger = true }) {
      return new Promise((resolve) => {
        const backdrop = document.getElementById('confirmBackdrop');
        document.getElementById('confirmTitle').textContent = title;
        document.getElementById('confirmMessage').textContent = message;
        const okBtn = document.getElementById('confirmOkBtn');
        okBtn.textContent = okLabel;
        okBtn.classList.toggle('confirm-btn--danger', danger);
        const cancelBtn = document.getElementById('confirmCancelBtn');

        const cleanup = (result) => {
          backdrop.classList.remove('open');
          okBtn.removeEventListener('click', onOk);
          cancelBtn.removeEventListener('click', onCancel);
          backdrop.removeEventListener('click', onBackdropClick);
          document.removeEventListener('keydown', onKeydown);
          resolve(result);
        };
        const onOk = () => cleanup(true);
        const onCancel = () => cleanup(false);
        const onBackdropClick = (e) => { if (e.target === backdrop) cleanup(false); };
        const onKeydown = (e) => { if (e.key === 'Escape') cleanup(false); };

        okBtn.addEventListener('click', onOk);
        cancelBtn.addEventListener('click', onCancel);
        backdrop.addEventListener('click', onBackdropClick);
        document.addEventListener('keydown', onKeydown);
        backdrop.classList.add('open');
      });
    }

    /* ── Greeting ── */
    const session = Auth.getSession();
    const rawName = session?.name?.split(' ')[0] || 'Traveler';
    const firstName = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();
    const h = new Date().getHours();
    const greetWord = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
    document.getElementById('greetingText').innerHTML = `${greetWord}, <span class="greeting-name">${firstName}</span>`;
    document.getElementById('dateText').textContent =
      new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' });

    /* ── Home search autocomplete ── */
    let homeAcTimer;

    async function homeFetchSuggestions(q) {
      try {
        const res  = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=12&language=en&format=json`);
        const data = await res.json();
        return (data.results || [])
          .filter(r => { const fc = r.feature_code || ''; return fc.startsWith('PPL') || fc === 'PPLC'; })
          .slice(0, 6);
      } catch { return []; }
    }

    function homeShowDd(results) {
      const dd = document.getElementById('homeSearchDd');
      if (!results.length) { dd.style.display = 'none'; return; }
      dd.innerHTML = results.map(r => {
        const sub = [r.admin1, r.country].filter(Boolean).join(', ');
        return `<div class="home-ac-item" onmousedown="homePickDest('${r.name.replace(/'/g, "\\'")}')">
          <div class="home-ac-pin"><svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
          <div><div class="home-ac-main">${r.name}</div>${sub ? `<div class="home-ac-sub">${sub}</div>` : ''}</div>
        </div>`;
      }).join('');
      dd.style.display = '';
    }

    function homeHideDd() {
      const dd = document.getElementById('homeSearchDd');
      if (dd) dd.style.display = 'none';
    }

    function homePickDest(name) {
      localStorage.setItem('exploreDestination', name);
      location.href = 'newTrip.html';
    }
    window.homePickDest = homePickDest;

    document.getElementById('homeSearchInput').addEventListener('input', e => {
      const q = e.target.value.trim();
      clearTimeout(homeAcTimer);
      if (!q) { homeHideDd(); return; }
      homeAcTimer = setTimeout(async () => {
        const results = await homeFetchSuggestions(q);
        homeShowDd(results);
      }, 260);
    });

    document.getElementById('homeSearchInput').addEventListener('blur', () => {
      setTimeout(homeHideDd, 160);
    });

    document.getElementById('homeSearchInput').addEventListener('keydown', e => {
      if (e.key === 'Escape') homeHideDd();
    });

    /* ── Trip management ── */
    function switchToTrip(tripId) {
      const trips = JSON.parse(localStorage.getItem('pm_trips') || '[]');
      const target = trips.find(t => t.id === tripId);
      if (!target) return;
      localStorage.setItem('currentTrip', JSON.stringify(target));
      location.reload();
    }
    function shareTrip(tripId) {
      const trips = JSON.parse(localStorage.getItem('pm_trips') || '[]');
      const t = trips.find(x => x.id === tripId);
      if (!t) return;
      const packRaw = JSON.parse(localStorage.getItem(`pm_pack_${tripId}`) || '{}');
      const items = Object.entries(packRaw.itemState || {}).map(([k, v]) => [k, v.packed ? 1 : 0, v.qty || 1]);
      const by = Auth.getSession()?.name || 'A friend';
      const payload = { v:1, sid:tripId, dest:t.destination, from:t.fromDate||'', to:t.toDate||'', trav:t.travelers||1, by, items,
        custom: packRaw.customItems || {}, dismissed: packRaw.dismissed || [] };
      const code = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
      const url = `${location.origin}/packing-list.html?join=${code}`;
      // Show share sheet or copy to clipboard
      if (navigator.share) {
        navigator.share({ title: `${t.destination} Packing List`, text: `Pack together for ${t.destination}!`, url }).catch(() => {});
      } else {
        navigator.clipboard.writeText(url).then(() => toast('Share link copied!')).catch(() => {
          prompt('Copy this link:', url);
        });
      }
    }
    async function deleteTrip(tripId) {
      const trips = JSON.parse(localStorage.getItem('pm_trips') || '[]');
      const target = trips.find(t => t.id === tripId);
      if (!target) return;

      const myId = Auth.getSession()?.userId;
      /* Trips cached before _ownerId existed won't have it — treat as
         owner (matches the original solo-owner assumption) rather than
         showing an unnecessarily scary "you can't undo this" for what
         might just be your own trip. */
      const isOwner = !target._ownerId || target._ownerId === myId;

      /* Unlike window.confirm(), this custom modal has no "user activation"
         expiry — Safari only silently drops the *native* dialog after an
         await, so it's safe to do the async member-count lookup first here
         and get the richer "N other packmates will lose access" message
         back. */
      let warning = isOwner
        ? `Delete trip to ${target.destination}? This cannot be undone.`
        : `Leave trip to ${target.destination}? You'll no longer see it or your packing progress — the trip itself stays intact for everyone else.`;
      if (isOwner) {
        const members = await DB.getTripMembers(tripId);
        const othersCount = members.filter(m => m.user_id !== myId).length;
        if (othersCount > 0) {
          warning = `Delete trip to ${target.destination}? ${othersCount} other packmate${othersCount !== 1 ? 's' : ''} will lose access to it too. This cannot be undone.`;
        }
      }
      const confirmed = await showConfirmModal({
        title: isOwner ? 'Delete trip?' : 'Leave trip?',
        message: warning,
        okLabel: isOwner ? 'Delete' : 'Leave',
      });
      if (!confirmed) return;

      const result = await DB.deleteTrip(tripId);
      if (!result.success) {
        alert('Could not delete this trip. Please check your connection and try again.');
        return;
      }
      location.reload();
    }

    /* ── Helpers ── */
    const fmt = d => { if (!d) return ''; const [y,m,day] = d.split('-'); return `${+m}/${+day}/${y}`; };
    const daysTo = s => s ? Math.ceil((new Date(s) - Date.now()) / 86400000) : null;
    function toast(msg) {
      const el = document.getElementById('toast');
      el.textContent = msg; el.classList.add('toast--visible');
      setTimeout(() => el.classList.remove('toast--visible'), 2600);
    }

    const AVATAR_COLORS = ['#5f9d30','#4a90d9','#e67e22','#9b59b6','#e74c3c','#1abc9c'];

    /* ── Weather ── */
    const WMO = {0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',48:'🌫️',51:'🌦️',53:'🌦️',55:'🌧️',61:'🌧️',63:'🌧️',65:'🌧️',71:'🌨️',73:'🌨️',75:'❄️',80:'🌦️',81:'🌧️',82:'⛈️',95:'⛈️',96:'⛈️',99:'⛈️'};

    function wxAnimClass(code) {
      if (code === 0 || code === 1)                          return 'wx-sunny';
      if (code === 2 || code === 3)                          return 'wx-cloudy';
      if (code === 45 || code === 48)                        return 'wx-foggy';
      if (code >= 51 && code <= 67)                          return 'wx-rainy';
      if (code >= 71 && code <= 77)                          return 'wx-snowy';
      if (code >= 80 && code <= 82)                          return 'wx-rainy';
      if (code >= 95 && code <= 99)                          return 'wx-stormy';
      return 'wx-idle';
    }

    async function fetchWeather(city) {
      const cacheKey = 'pm_wx_' + city.toLowerCase().replace(/\s+/g, '_');
      const WX_TTL = 15 * 60 * 1000;
      try {
        const cached = JSON.parse(localStorage.getItem(cacheKey) || 'null');
        if (cached && Date.now() - cached.ts < WX_TTL) return cached.data;
      } catch {}
      try {
        const g = await (await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`)).json();
        if (!g.results?.[0]) return null;
        const {latitude:lat, longitude:lon} = g.results[0];
        const w = await (await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit`)).json();
        const cw = w.current_weather;
        const data = { temp: Math.round(cw.temperature), icon: WMO[cw.weathercode] || '🌡️', code: cw.weathercode };
        try { localStorage.setItem(cacheKey, JSON.stringify({ data, ts: Date.now() })); } catch {}
        return data;
      } catch { return null; }
    }

    /* ── Progress ring ── */
    let _ringId = 0;
    function ring(pct, size=80, stroke=6) {
      const id   = 'rg' + (++_ringId);
      const r    = (size - stroke) / 2;
      const circ = 2 * Math.PI * r;
      const dash = (pct / 100) * circ;
      const big  = size >= 90;
      const glow = big ? ' style="filter:drop-shadow(0 0 10px rgba(95,157,48,0.45))"' : '';
      const cy1  = size / 2 + (big ? -4 : 5);
      const cy2  = size / 2 + 11;
      const targetOffset = circ - dash;
      return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"${glow}>
        <defs>
          <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#7cc63e"/>
            <stop offset="100%" stop-color="#4d8225"/>
          </linearGradient>
        </defs>
        <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="rgba(255,255,255,0.09)" stroke-width="${stroke}"/>
        <circle class="ring-arc" cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="url(#${id})" stroke-width="${stroke}"
          stroke-dasharray="${circ}"
          stroke-linecap="round" transform="rotate(-90 ${size/2} ${size/2})"
          data-target="${targetOffset}"
          style="stroke-dashoffset:${circ}"/>
        <text x="${size/2}" y="${cy1}" text-anchor="middle" fill="white"
          font-size="${big?15:13}" font-weight="700" font-family="Montserrat,sans-serif">${pct}%</text>
        ${big ? `<text x="${size/2}" y="${cy2}" text-anchor="middle" fill="rgba(255,255,255,0.38)"
          font-size="8" font-weight="700" font-family="Montserrat,sans-serif" letter-spacing="1">PACKED</text>` : ''}
      </svg>`;
    }

    /* ── Data ── */
    const trip      = JSON.parse(localStorage.getItem('currentTrip') || 'null');
    const _packRaw  = trip?.id ? JSON.parse(localStorage.getItem(`pm_pack_${trip.id}`) || '{}') : {};
    const packState = Object.fromEntries(
        Object.entries(_packRaw.itemState || {}).map(([k, v]) => [k, !!v?.packed])
    );
    const hasTrip   = !!trip?.destination;
    const bento     = document.getElementById('bentoGrid');

    const allKeys        = Object.keys(packState);
    const packedKeys     = allKeys.filter(k => packState[k]);
    // Use full suggested count (including dismissed) so packing 4/68 shows ~6%, not 100%
    const totalSuggested = _packRaw.totalSuggested || _packRaw.suggestedTotal || allKeys.length;
    const pct            = PackingMath.calcPackedPct(packedKeys.length, totalSuggested);

    const days         = hasTrip ? daysTo(trip.fromDate) : null;
    const countdownNum = !hasTrip ? '—' : days === null ? '—' : days > 0 ? days : days === 0 ? '0' : '✓';
    const countdownUnit= !hasTrip ? 'no trip yet' : days === null ? '' : days > 0 ? 'days away' : days === 0 ? 'today!' : 'underway';
    const chips        = hasTrip ? (trip.activityCategories||[]).slice(0,5).map(a=>`<span class="bc-hero-chip">${a}</span>`).join('') : '';

    /* ── Pre-compute packmates + nudge link ── */
    const nudgeLink = hasTrip ? 'packing-list.html' : 'newTrip.html';
    let packmatesHtml = '';
    if (hasTrip) {
      const tn = Math.min(parseInt(trip.travelers) || 1, 5);
      let stack = '';
      for (let i = 0; i < tn; i++) {
        const col = i === 0 ? '#0d3347' : AVATAR_COLORS[i % AVATAR_COLORS.length];
        const lbl = i === 0 ? firstName.charAt(0).toUpperCase() : '✦';
        const fs  = i > 0 ? 'font-size:0.5rem;' : '';
        stack += `<div class="bc-pm-avatar" style="background:${col};${fs}">${lbl}</div>`;
      }
      const tnLabel = tn > 1 ? `You + ${tn - 1} more` : 'Solo trip';
      packmatesHtml = `<div class="bc-packmates-row"><div class="bc-packmates-stack">${stack}</div><span class="bc-packmates-label">${tnLabel}</span></div>`;
    }

    /* ── Always render full bento ── */
    bento.innerHTML = `
      <!-- HERO -->
      <div class="bc bc-hero" id="heroCard" style="cursor:${hasTrip?'pointer':'default'}">
        ${hasTrip && trip.imageUrl ? `<div class="bc-hero-img" id="heroBg" style="background-image:url('${trip.imageUrl}')"></div>` : '<div class="bc-hero-img" id="heroBg"></div>'}
        <div class="bc-hero-overlay"></div>

        ${!hasTrip ? `
        <div style="position:relative;z-index:2;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:32px;text-align:center;">
          <img src="img/appIcon.png" alt="Packmates" style="width:72px;height:72px;border-radius:18px;box-shadow:0 8px 24px rgba(0,0,0,0.3);object-fit:cover;">
          <div>
            <div style="font-family:'Blauer Nue',sans-serif;font-size:1.6rem;font-weight:700;color:#fff;letter-spacing:-0.02em;margin-bottom:6px;">Plan your next adventure</div>
            <div style="font-size:0.8rem;color:rgba(255,255,255,0.5);max-width:280px;line-height:1.6;">Create a trip and get a smart packing list tailored to your destination and activities.</div>
          </div>
          <button onclick="location.href='newTrip.html'" style="padding:12px 28px;background:var(--green);color:#fff;border:none;border-radius:10px;font-family:'Montserrat',sans-serif;font-size:0.82rem;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:background 0.2s,transform 0.2s;" onmouseover="this.style.background='#4d8225';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#5f9d30';this.style.transform=''">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Create First Trip
          </button>
        </div>` : `
        <!-- Active trip hero -->
        <div class="bc-hero-body">
          <div class="bc-hero-left">
            <div class="bc-hero-tag">Active Trip</div>
            <div class="bc-hero-dest">${trip.destination}</div>
            <div class="bc-hero-dates">${trip.fromDate && trip.toDate ? `${fmt(trip.fromDate)} — ${fmt(trip.toDate)}` : 'Dates not set'}</div>
            ${chips ? `<div class="bc-hero-chips">${chips}</div>` : ''}
            ${packmatesHtml}
            <div class="bc-hero-actions">
              <button class="bc-hero-btn" id="shareBtn">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                Share
              </button>
              <span class="bc-hero-weather" id="weatherBadge">🌡 —</span>
            </div>
          </div>
          <div class="bc-hero-right">
            ${ring(pct, 96, 7)}
            <div class="bc-hero-ring-label">${totalSuggested > 0 ? `${packedKeys.length} of ${totalSuggested}<br>items packed` : 'No items yet'}</div>
          </div>
        </div>`}
      </div>

      <!-- COUNTDOWN / BOARDING PASS -->
      <div class="bc bc-countdown">${(() => {
        const airline = trip?.airline || null;
        const baggageRows = airline ? `
          <div class="bc-board-bag-row">
            <span class="bc-board-bag-label">Carry-on</span>
            <span class="bc-board-bag-val">${airline.carry.dims}</span>
            ${airline.carry.weight !== 'No limit' ? `<span class="bc-board-bag-fee">${airline.carry.weight}</span>` : ''}
          </div>
          <div class="bc-board-bag-row">
            <span class="bc-board-bag-label">Checked</span>
            <span class="bc-board-bag-val">${airline.checked.weight}</span>
            <span class="bc-board-bag-fee">${airline.checked.fee}</span>
          </div>` : `
          <div class="bc-board-bag-row">
            <span class="bc-board-bag-label">Carry-on</span>
            <span class="bc-board-bag-val">56×36×23 cm</span>
          </div>
          <div class="bc-board-bag-row">
            <span class="bc-board-bag-label">Checked</span>
            <span class="bc-board-bag-val">23 kg / 50 lbs</span>
            <span class="bc-board-bag-fee" style="background:rgba(0,0,0,0.04);color:var(--text-3);">typical</span>
          </div>
          <div style="font-size:0.6rem;color:var(--text-3);margin-top:2px;">Add airline for exact limits</div>`;
        return `
          <div class="bc-lug-top">
            <div class="bc-lug-header">
              <div class="bc-label"><span class="bc-label-dot" style="background:#f59e0b;box-shadow:0 0 6px rgba(245,158,11,0.5)"></span>Luggage</div>
              ${airline ? `<div class="bc-board-airline" style="margin-bottom:0">
                <div class="bc-board-airline-logo">
                  <img src="https://www.gstatic.com/flights/airline_logos/70px/${airline.iata}.png"
                       alt="${airline.iata}"
                       loading="lazy"
                       onerror="this.style.display='none';this.parentElement.innerHTML='<span style=\\'font-size:0.6rem;font-weight:800;color:var(--teal-a)\\'>${airline.iata}</span>'">
                </div>
                <span class="bc-board-airline-name">${airline.name}</span>
              </div>` : ''}
            </div>
            <div class="bc-lug-icon-area">
              <div class="bc-lug-icon-wrap">
                <img src="img/luggage.png" alt="Luggage" class="bc-lug-img" loading="lazy">
              </div>
            </div>
          </div>
          <div class="bc-board-perf">
            <div class="bc-board-perf-dot"></div>
            <div class="bc-board-perf-dot"></div>
          </div>
          <div class="bc-board-baggage">${baggageRows}</div>`;
      })()}</div>

      <!-- PROGRESS -->
      <div class="bc bc-progress">
        <div class="bc-progress-label">Packing Progress</div>
        <div class="bc-progress-inner">
          <div class="bc-progress-text">
            <div class="bc-progress-pct">${pct}%</div>
            <div class="bc-progress-sub">${totalSuggested > 0 ? `${packedKeys.length} of ${totalSuggested} items` : 'Create a trip to start'}</div>
          </div>
          ${ring(pct, 72, 5)}
        </div>
        <div class="bc-progress-bar-track">
          <div class="bc-progress-bar-fill" style="width:${pct}%"></div>
        </div>
      </div>

      <!-- WEATHER -->
      <div class="bc bc-weather">
        <div class="bc-weather-label">Destination Weather</div>
        <div class="bc-weather-main" id="weatherMain">
          <div class="bc-weather-icon wx-idle" id="wIcon">${hasTrip ? '⛅' : '☀️'}</div>
          <div class="bc-weather-info">
            <div class="bc-weather-temp" id="weatherTemp">${hasTrip ? '—°F' : '—'}</div>
            <div class="bc-weather-cond" id="weatherCond">${hasTrip ? 'Loading…' : 'Plan a trip first'}</div>
            <div class="bc-weather-city">${hasTrip ? trip.destination : 'No destination'}</div>
          </div>
        </div>
      </div>

      <!-- TRAVEL VIDEO CARD -->
      <div class="bc bc-tip bc-video-card" onclick="location.href='${nudgeLink}'" style="cursor:pointer;padding:0;background:#071e2a;">
        <video id="tipVideo" autoplay muted loop playsinline preload="none" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;opacity:0;transition:opacity 0.8s ease;border-radius:inherit;"></video>
        <div style="position:absolute;inset:0;z-index:1;background:linear-gradient(160deg,rgba(7,30,42,0.0) 0%,rgba(7,30,42,0.08) 100%);border-radius:inherit;pointer-events:none;"></div>
        <div style="position:relative;z-index:2;height:100%;display:flex;flex-direction:column;justify-content:flex-end;padding:20px 22px;">
          <div style="font-size:1rem;font-weight:700;color:#fff;line-height:1.25;text-shadow:0 1px 8px rgba(0,0,0,0.4);" id="nudgeTitle">Ready to start?</div>
        </div>
      </div>

      <!-- ACTIONS -->
      <div class="bc bc-actions">
        <div class="bc-actions-title">Quick Actions</div>
        <button class="bc-action-btn" onclick="location.href='newTrip.html'">
          <svg class="bca-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          <span class="bca-label">New Trip</span><span class="bca-arrow">›</span>
        </button>
        <button class="bc-action-btn" onclick="location.href='packing-list.html'">
          <svg class="bca-icon" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>
          <span class="bca-label">Packing List</span><span class="bca-arrow">›</span>
        </button>
        <button class="bc-action-btn" onclick="location.href='${hasTrip ? 'tripPreview.html' : 'newTrip.html'}'">
          <svg class="bca-icon" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <span class="bca-label">${hasTrip ? 'Trip Details' : 'Plan a Trip'}</span><span class="bca-arrow">›</span>
        </button>
        <button class="bc-action-btn" onclick="location.href='discover.html'">
          <svg class="bca-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
          <span class="bca-label">Discover</span><span class="bca-arrow">›</span>
        </button>
        <button class="bc-action-btn" onclick="location.href='joinTrip.html'">
          <svg class="bca-icon" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
          <span class="bca-label">Join Trip</span><span class="bca-arrow">›</span>
        </button>
      </div>`;

    /* ── Animate progress rings on every load ── */
    /* getBoundingClientRect forces a reflow so the browser commits the initial
       stroke-dashoffset before we add the transition and set the target value */
    setTimeout(() => {
      document.querySelectorAll('.ring-arc').forEach(arc => {
        arc.getBoundingClientRect();
        arc.style.transition = 'stroke-dashoffset 1.3s cubic-bezier(0.22,1,0.36,1)';
        arc.style.strokeDashoffset = arc.dataset.target;
      });
    }, 80);

    /* ── Hero interactions (only when trip exists) ── */
    if (hasTrip) {
      document.getElementById('heroCard').addEventListener('click', e => {
        if (!e.target.closest('#shareBtn')) location.href = 'tripPreview.html';
      });
      document.getElementById('shareBtn').addEventListener('click', async e => {
        e.stopPropagation();
        const text = `✈️ Heading to ${trip.destination}!\n📅 ${fmt(trip.fromDate)} – ${fmt(trip.toDate)}\n🎒 Packed with Packmates`;
        if (navigator.share) { try { await navigator.share({ title: trip.destination + ' Trip', text }); } catch {} }
        else { try { await navigator.clipboard.writeText(text); toast('Trip details copied!'); } catch { toast('Could not copy'); } }
      });
      const bg = document.getElementById('heroBg');
      document.getElementById('heroCard').addEventListener('mousemove', e => {
        const r = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        if (bg) bg.style.transform = `scale(1.06) translate(${x*14}px,${y*8}px)`;
      });
      document.getElementById('heroCard').addEventListener('mouseleave', () => {
        if (bg) bg.style.transform = 'scale(1)';
      });
      fetchWeather(trip.destination).then(w => {
        if (!w) { document.getElementById('weatherCond').textContent = 'Unavailable'; return; }
        const iconEl = document.getElementById('wIcon');
        iconEl.textContent = w.icon;
        iconEl.className = 'bc-weather-icon ' + wxAnimClass(w.code);
        document.getElementById('weatherTemp').textContent = w.temp + '°F';
        document.getElementById('weatherCond').textContent = 'Current conditions';
        const wb = document.getElementById('weatherBadge');
        if (wb) wb.textContent = `${w.icon} ${w.temp}°F`;
      });
    }

    /* ── Trip card in grid ── */
    const tripsGrid = document.getElementById('tripsGrid');
    const allTrips  = JSON.parse(localStorage.getItem('pm_trips') || '[]');
    // Backfill legacy: if currentTrip isn't in pm_trips yet, add it
    if (trip && !allTrips.find(t => t.id === trip.id)) {
      allTrips.push(trip);
      localStorage.setItem('pm_trips', JSON.stringify(allTrips));
    }
    if (allTrips.length > 0) {
      document.getElementById('tripsSection').style.display = '';
      const _myId = Auth.getSession()?.userId;
      tripsGrid.innerHTML = allTrips.slice().reverse().map(t => {
        const isActive = t.id === trip?.id;
        const tDays = t.fromDate ? daysTo(t.fromDate) : null;
        const daysLabel = tDays === null ? '' : tDays > 0 ? `${tDays}d away` : tDays === 0 ? 'Today!' : 'Underway';
        const isOwnedByMe = !t._ownerId || t._ownerId === _myId;
        const deleteLabel = isOwnedByMe ? 'Delete trip' : 'Leave trip';
        return `
          <div class="trip-card${isActive ? ' trip-card--active' : ''}" id="tc-${t.id}">
            <div class="trip-card-img" onclick="${isActive ? `location.href='tripPreview.html'` : `switchToTrip('${t.id}')`}" style="position:relative">
              <img src="${t.imageUrl || 'img/placeholderTrip.png'}" alt="${t.destination}" loading="lazy">
              ${isActive
                ? '<div class="trip-card-badge">Active</div>'
                : '<div class="trip-card-badge trip-card-badge--switch">Switch</div>'}
            </div>
            <div class="trip-card-body" onclick="${isActive ? `location.href='tripPreview.html'` : `switchToTrip('${t.id}')`}">
              <div class="trip-card-title">${t.destination}</div>
              <div class="trip-card-dates">${t.fromDate && t.toDate ? `${fmt(t.fromDate)} – ${fmt(t.toDate)}` : 'Dates not set'}${daysLabel ? ` · <span style="color:var(--green-dark,#4d8225);font-weight:600">${daysLabel}</span>` : ''}</div>
              <div class="trip-card-footer">
                <div class="avatars" id="cardAvatars-${t.id}"></div>
                <div style="display:flex;align-items:center;gap:6px">
                  <button class="trip-card-share" onclick="event.stopPropagation();shareTrip('${t.id}')" title="Share packing list">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                    Share
                  </button>
                  <button class="trip-card-delete" onclick="event.stopPropagation();deleteTrip('${t.id}')" title="${deleteLabel}" aria-label="${deleteLabel}">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>`;
      }).join('');
      allTrips.forEach(t => {
        const av = document.getElementById(`cardAvatars-${t.id}`);
        if (!av) return;
        for (let i = 0; i < Math.min(parseInt(t.travelers)||1, 5); i++) {
          const s = document.createElement('span');
          s.style.background = AVATAR_COLORS[i % AVATAR_COLORS.length];
          s.textContent = '✦'; s.style.fontSize = '0.45rem';
          av.appendChild(s);
        }
      });
    } else {
      document.getElementById('tripsSection').style.display = 'none';
    }

    /* ── Travel video card ── */
    (() => {
      const videoEl = document.getElementById('tipVideo');
      if (!videoEl) return;

      /* This card used to auto-fetch and rotate in Pexels stock aerial
         footage, which unconditionally overrode whatever was playing —
         instantly for a returning visitor (cached rotation pool), or
         within a couple seconds for a first-time one (once the Pexels
         fetch resolved). That's why a real video set here never actually
         stayed visible. Removed entirely: this card now just plays the
         one local video, with a same-file reload as the only fallback
         if it fails to load at all. Also clears any previously cached
         rotation-pool state so a returning visitor's browser doesn't
         have stale data lying around. */
      ['pm_tip_video', 'pm_tip_idx', 'pm_tip_videos', 'pm_tip_ver'].forEach(k => localStorage.removeItem(k));

      function playVideo(url) {
        videoEl.src = url;
        videoEl.load();
        videoEl.play().catch(() => {});
        videoEl.onloadeddata = () => { videoEl.style.opacity = '1'; };
        videoEl.oncanplay   = () => { videoEl.style.opacity = '1'; };
      }
      playVideo('img/hero-ready-to-start.mp4');
      videoEl.onerror = () => playVideo('img/hero-forest-compressed.mp4');
    })();

    /* ── Micro-stats ── */
    (function () {
      const el = id => document.getElementById(id);
      if (el('statTrips')) el('statTrips').textContent = allTrips.length || 0;
      if (el('statPacked')) {
        const total = allTrips.reduce((s, t) =>
          s + Object.values(t.packItemState || {}).filter(v => v?.packed).length, 0);
        el('statPacked').textContent = total;
      }
      if (el('statDest')) el('statDest').textContent = new Set(allTrips.map(t => t.destination).filter(Boolean)).size;
    })();

    /* ── Destinations data + cache helpers (used by Inspired + Explore) ── */
    const DESTS = [
      {name:'Paris',     country:'France',     img:'img/paris.jpg',     fallback:'linear-gradient(135deg,#4a6fa5,#2c3e50)'},
      {name:'Bali',      country:'Indonesia',  img:'img/bali.jpg',      fallback:'linear-gradient(135deg,#e67e22,#c0392b)'},
      {name:'New York',  country:'USA',        img:'img/newyork.jpg',   fallback:'linear-gradient(135deg,#2c3e50,#3498db)'},
      {name:'Tokyo',     country:'Japan',      img:'img/tokyo.jpg',     fallback:'linear-gradient(135deg,#c0392b,#8e44ad)'},
      {name:'Cancun',    country:'Mexico',     img:'img/cancun.jpg',    fallback:'linear-gradient(135deg,#00b09b,#0099cc)'},
      {name:'Dubai',     country:'UAE',        img:'img/dubai.jpg',     fallback:'linear-gradient(135deg,#f7971e,#ffd200)'},
      {name:'Rome',      country:'Italy',      img:'img/rome.jpg',      fallback:'linear-gradient(135deg,#d35400,#e74c3c)'},
      {name:'Santorini', country:'Greece',     img:'img/santorini.jpg', fallback:'linear-gradient(135deg,#1a78c2,#00c6ff)'},
      {name:'Maldives',  country:'Maldives',   img:'img/maldives.jpg',  fallback:'linear-gradient(135deg,#00b4db,#0083b0)'},
      {name:'Banff',     country:'Canada',     img:'img/banff.jpg',     fallback:'linear-gradient(135deg,#2d6a4f,#1b4332)'},
      {name:'Barcelona', country:'Spain',      img:'img/barcelona.jpg', fallback:'linear-gradient(135deg,#f093fb,#c0392b)'},
      {name:'Sydney',    country:'Australia',  img:'img/sydney.jpg',    fallback:'linear-gradient(135deg,#4facfe,#00f2fe)'},
    ];
    const CACHE_TTL = 7 * 24 * 60 * 60 * 1000;
    function getDestCache(name) {
      try {
        const raw = localStorage.getItem('pm_dest_' + name);
        if (!raw) return null;
        const { url, ts } = JSON.parse(raw);
        if (Date.now() - ts > CACHE_TTL) { localStorage.removeItem('pm_dest_' + name); return null; }
        return url;
      } catch { return null; }
    }
    function setDestCache(name, url) {
      try { localStorage.setItem('pm_dest_' + name, JSON.stringify({ url, ts: Date.now() })); } catch {}
    }
    async function fetchDestPhoto(query) {
      try {
        const res  = await fetch(
          `/api/pexels?query=${encodeURIComponent(query)}&orientation=landscape&per_page=5`,
          { headers: { Authorization: `Bearer ${await Auth.getTokenAsync()}` } }
        );
        const data = await res.json();
        const photos = data.photos || [];
        if (!photos.length) return null;
        const pick = photos[Math.floor(Math.random() * photos.length)];
        return pick.src.medium || pick.src.large || null;
      } catch { return null; }
    }

    /* ── Others Also Packed ── */
    // [name, pct, circleBg, barColor]
    const POPULAR = {
      'Beach':           [['Sunscreen',90,'rgba(255,200,40,0.15)','#f5a623'],['Beach Towel',88,'rgba(30,150,220,0.14)','#29b6f6'],['Sunglasses',85,'rgba(255,200,40,0.12)','#f5a623'],['Flip Flops',82,'rgba(30,150,220,0.11)','#29b6f6'],['Snorkel Set',72,'rgba(30,200,200,0.12)','#26c6da']],
      'Hiking':          [['Hiking Boots',94,'rgba(95,157,48,0.15)','#7cc63e'],['Water Bottle',89,'rgba(95,157,48,0.12)','#7cc63e'],['Backpack',87,'rgba(95,157,48,0.10)','#7cc63e'],['Insect Repellent',75,'rgba(78,180,130,0.12)','#4ecece'],['Snacks',72,'rgba(220,150,50,0.12)','#f5a623']],
      'Camping':         [['Tent',95,'rgba(52,140,80,0.15)','#4caf50'],['Sleeping Bag',93,'rgba(52,140,80,0.13)','#4caf50'],['Camp Stove',80,'rgba(52,140,80,0.10)','#4caf50'],['Insect Repellent',77,'rgba(78,180,130,0.11)','#4ecece'],['Firestarter',70,'rgba(52,140,80,0.09)','#4caf50']],
      'Road Trip':       [['Snacks',91,'rgba(220,150,50,0.15)','#f5a623'],['Car Charger',88,'rgba(220,150,50,0.13)','#f5a623'],['Travel Pillow',82,'rgba(220,150,50,0.10)','#f5a623'],['Sunglasses',79,'rgba(255,200,40,0.11)','#f5a623'],['Water Bottle',76,'rgba(95,157,48,0.10)','#7cc63e']],
      'Snow Sports':     [['Ski Jacket',94,'rgba(100,160,220,0.15)','#42a5f5'],['Gloves',91,'rgba(100,160,220,0.13)','#42a5f5'],['Thermal Base Layer',88,'rgba(100,160,220,0.11)','#42a5f5'],['Ski Goggles',85,'rgba(100,160,220,0.09)','#42a5f5'],['Wool Socks',80,'rgba(95,157,48,0.12)','#7cc63e']],
      'Business Trip':   [['Laptop',96,'rgba(100,100,200,0.15)','#7986cb'],['Business Cards',85,'rgba(100,100,200,0.12)','#7986cb'],['Dress Shirts',84,'rgba(100,100,200,0.10)','#7986cb'],['Blazer',81,'rgba(100,100,200,0.09)','#7986cb'],['Notebook',76,'rgba(100,100,200,0.08)','#7986cb']],
      'City Sightseeing':[['Camera',89,'rgba(78,206,206,0.15)','#4ecece'],['Sneakers',87,'rgba(78,206,206,0.12)','#4ecece'],['Backpack',84,'rgba(95,157,48,0.11)','#7cc63e'],['Water Bottle',78,'rgba(95,157,48,0.09)','#7cc63e'],['Travel Guidebook',70,'rgba(78,206,206,0.09)','#4ecece']],
      'Swimming':        [['Goggles',92,'rgba(30,200,200,0.15)','#26c6da'],['Swim Cap',82,'rgba(30,200,200,0.12)','#26c6da'],['Aqua Shoes',75,'rgba(30,200,200,0.10)','#26c6da'],['Sunscreen',85,'rgba(255,200,40,0.12)','#f5a623'],['Flip Flops',78,'rgba(30,150,220,0.11)','#29b6f6']],
      'Gym':             [['Workout Clothes',91,'rgba(255,130,50,0.15)','#ff7043'],['Sports Shoes',88,'rgba(255,130,50,0.13)','#ff7043'],['Gym Towel',82,'rgba(255,130,50,0.11)','#ff7043'],['Water Bottle',79,'rgba(255,130,50,0.09)','#ff7043'],['Running Shoes',74,'rgba(255,130,50,0.08)','#ff7043']],
      'Night Out':       [['Blazer',88,'rgba(12,122,122,0.15)','#0c7a7a'],['Dress Shoes',84,'rgba(12,122,122,0.12)','#0c7a7a'],['Perfume/Cologne',80,'rgba(12,122,122,0.10)','#0c7a7a'],['Watch',75,'rgba(95,157,48,0.12)','#7cc63e'],['Jumpsuit',70,'rgba(12,122,122,0.09)','#0c7a7a']],
      'Festival':        [['Tent',89,'rgba(95,157,48,0.15)','#5f9d30'],['Sleeping Bag',86,'rgba(95,157,48,0.13)','#5f9d30'],['Sunglasses',83,'rgba(12,122,122,0.12)','#0c7a7a'],['Water Bottle',80,'rgba(95,157,48,0.10)','#7cc63e'],['Fanny Pack',76,'rgba(12,122,122,0.10)','#0c7a7a']],
      'Cruise':          [['Matching Set',90,'rgba(30,100,200,0.15)','#42a5f5'],['Motion Sickness Medication',85,'rgba(30,100,200,0.12)','#42a5f5'],['Panama Hat',82,'rgba(30,100,200,0.10)','#42a5f5'],['Waterproof Sandals',79,'rgba(30,100,200,0.09)','#42a5f5'],['Floral Top',74,'rgba(30,100,200,0.08)','#42a5f5']],
      'Dining':          [['Blazer',87,'rgba(180,80,80,0.15)','#ef5350'],['Dress Shoes',83,'rgba(180,80,80,0.12)','#ef5350'],['Button-Down Shirts',79,'rgba(180,80,80,0.10)','#ef5350'],['Dress Pants',74,'rgba(180,80,80,0.09)','#ef5350'],['Tie',70,'rgba(180,80,80,0.08)','#ef5350']],
      'Theme Park':      [['Sneakers',93,'rgba(220,100,50,0.15)','#ff7043'],['Water Bottle',89,'rgba(220,100,50,0.12)','#ff7043'],['Sunglasses',85,'rgba(220,100,50,0.10)','#ff7043'],['Power Bank',78,'rgba(100,100,200,0.10)','#7986cb'],['Camera',74,'rgba(78,206,206,0.10)','#4ecece']],
      'Baby':            [['Diapers',97,'rgba(78,206,206,0.15)','#4ecece'],['Baby Wipes',95,'rgba(78,206,206,0.13)','#4ecece'],['Baby Bottle',90,'rgba(95,157,48,0.13)','#7cc63e'],['Baby Clothes',87,'rgba(78,206,206,0.11)','#4ecece'],['Stroller',82,'rgba(95,157,48,0.10)','#7cc63e']],
      '_default':        [['Passport',97,'rgba(78,206,206,0.15)','#4ecece'],['Charger',95,'rgba(100,100,200,0.14)','#7986cb'],['Power Bank',90,'rgba(100,100,200,0.12)','#7986cb'],['Sneakers',85,'rgba(78,206,206,0.11)','#4ecece'],['Headphones',80,'rgba(100,100,200,0.10)','#7986cb']],
    };

    const activities = trip?.activityCategories?.length ? trip.activityCategories : ['_default'];
    const seen = new Set();
    const popularItems = [];
    activities.forEach(act => {
      (POPULAR[act] || POPULAR['_default']).forEach(item => {
        if (!seen.has(item[0])) { seen.add(item[0]); popularItems.push(item); }
      });
    });

    const shownItems = popularItems.slice(0, 5);
    const topPct = Math.max(...shownItems.map(([,pct]) => pct));
    document.getElementById('packedStrip').innerHTML = shownItems.map(([name, pct, circleBg, barColor]) => `
      <div class="packed-chip">
        <span class="packed-chip-pct">${pct}%</span>
        <div class="packed-chip-circle" style="background:${circleBg}">
          ${getItemIcon(name)}
        </div>
        ${pct === topPct ? '<div class="packed-top-pick">⭐ TOP PICK</div>' : ''}
        <div class="packed-chip-name">${name}</div>
        <div class="packed-chip-bar"><div class="packed-chip-fill" style="width:${pct}%;background:${barColor}"></div></div>
      </div>`).join('');

    /* ── Explore destinations with real photos ── */
    const strip = document.getElementById('exploreStrip');

    DESTS.forEach(d => {
      const c = document.createElement('div');
      c.className = 'explore-card';

      const imgSrc = d.img || getDestCache(d.name);
      const bgStyle = imgSrc
        ? `background:${d.fallback};background-image:url('${imgSrc}');background-size:cover;background-position:center`
        : `background:${d.fallback}`;

      c.innerHTML = `
        <div class="explore-card-bg" id="expbg-${d.name.replace(/\s+/g,'_')}" style="${bgStyle}"></div>
        <div class="explore-card-overlay"></div>
        <div class="explore-card-arrow"><svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div>
        <div class="explore-card-label">${d.name}</div>
        <div class="explore-card-country">${d.country}</div>`;

      c.addEventListener('click', () => {
        localStorage.setItem('exploreDestination', d.name);
        location.href = 'newTrip.html';
      });
      strip.appendChild(c);
    });

    /* Fetch photos in background for any destinations without a local image */
    (async () => {
      for (const d of DESTS) {
        if (d.img || getDestCache(d.name)) continue;
        const url = await fetchDestPhoto(d.query||d.name);
        if (url) {
          setDestCache(d.name, url);
          const bgEl = document.getElementById('expbg-' + d.name.replace(/\s+/g,'_'));
          if (bgEl) {
            // Preload then fade in
            const img = new Image();
            img.onload = () => {
              bgEl.style.transition = 'background-image 0.4s ease';
              bgEl.style.backgroundImage = `url('${url}')`;
            };
            img.src = url;
          }
        }
        // Small delay between requests to avoid hammering the API
        await new Promise(r => setTimeout(r, 120));
      }
    })();

    /* ── Supabase background sync: pull latest trips, reload once if data differs ── */
    if (!sessionStorage.getItem('pm_synced')) {
      (async () => {
        const before = JSON.stringify((JSON.parse(localStorage.getItem('pm_trips') || '[]')).map(t => t.id + t.destination));
        const changed = await DB.syncTrips();
        if (!changed) return;
        const after = JSON.stringify((JSON.parse(localStorage.getItem('pm_trips') || '[]')).map(t => t.id + t.destination));
        if (before !== after) {
          sessionStorage.setItem('pm_synced', '1');
          location.reload();
        }
      })().catch(() => {});
    }

    /* ── Realtime: live cross-device sync via Supabase channel ── */
    (async () => {
      const sbClient = await window._pm_sbLoaded;
      if (!sbClient) return;
      const { data: { session } } = await sbClient.auth.getSession();
      if (!session) return;
      sbClient.channel('trips-realtime')
        .on('postgres_changes', {
          event: '*', schema: 'public', table: 'trips',
          filter: `user_id=eq.${session.user.id}`
        }, async () => {
          if (sessionStorage.getItem('pm_synced')) return;
          const changed = await DB.syncTrips();
          if (changed) { sessionStorage.setItem('pm_synced', '1'); location.reload(); }
        })
        .subscribe();
    })().catch(() => {});

    /* ── Service worker (offline support) ── */
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js').catch(() => {});
    }
