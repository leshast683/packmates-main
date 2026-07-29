// ═══════════════════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════════════════
const tripData    = JSON.parse(localStorage.getItem('currentTrip') || '{}');
const profile     = buildTripProfile(tripData);
const userGender  = (() => { try { return (Auth?.getSession?.()?.gender) || JSON.parse(localStorage.getItem('pm_session') || 'null')?.gender || 'nonbinary'; } catch { return 'nonbinary'; } })();
const _ALL_P = { hot:true, cold:true, beach:true, gym:true, business:true, hiking:true, camping:true, rainy:true, swimming:true, ski:true, snowy:true, windy:true, citySightseeing:true, dining:true, nightOut:true, baby:true, themePark:true, festival:true, roadTrip:true, cruise:true };
function getItemGender(cat, name) {
    const item = (ITEM_DB[cat] || []).find(i => i.name === name);
    if (!item) return null;
    const forMale   = item.suggest(_ALL_P, 'male');
    const forFemale = item.suggest(_ALL_P, 'female');
    if (forMale && !forFemale) return 'male';
    if (!forMale && forFemale) return 'female';
    return null;
}

// City banner image
const cityBanner = document.getElementById('cityBanner');

function applyHeroBanner(url) {
    if (!cityBanner || !url) return;
    cityBanner.style.backgroundImage = `url('${url}')`;
    cityBanner.classList.add('has-image');
    document.querySelector('body > main')?.classList.add('has-city-banner');
}

async function fetchAndCacheCityImage(dest) {
    try {
        const PEXELS_KEY = 'vnk5OqRIBUtBdRV9LUp1oaAn2QiAB5lO0HL8GwM5WrRRQZt5GOaFlVIq';
        const res  = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(dest)}+city+travel&orientation=landscape&per_page=5&size=large`,
            { headers: { Authorization: PEXELS_KEY } }
        );
        const data = await res.json();
        const url  = data.photos?.[0]?.src?.large || null;
        if (url) {
            // Save back to trip so next load is instant
            const saved = JSON.parse(localStorage.getItem('currentTrip') || '{}');
            saved.imageUrl = url;
            localStorage.setItem('currentTrip', JSON.stringify(saved));
        }
        return url;
    } catch { return null; }
}

if (tripData.imageUrl) {
    applyHeroBanner(tripData.imageUrl);
} else if (tripData.destination) {
    fetchAndCacheCityImage(tripData.destination).then(applyHeroBanner);
}

const destination = tripData.destination || 'Trip';
const fromDate    = tripData.fromDate    || '';
const toDate      = tripData.toDate      || '';
const travelers   = tripData.travelers   || 1;

function formatDate(d) {
    if (!d) return '';
    const [y, m, day] = d.split('-');
    return `${parseInt(m)}/${parseInt(day)}/${y}`;
}
function tripDays(from, to) {
    if (!from || !to) return null;
    return Math.max(1, Math.round((new Date(to) - new Date(from)) / 86400000) + 1);
}

const days = tripDays(fromDate, toDate);

// getItemKey provided by lib/packing-items.js

// Per-trip pack state lives under pm_pack_${tripId}
const _PACK_KEY = tripData.id ? `pm_pack_${tripData.id}` : null;
const _packRaw  = _PACK_KEY ? JSON.parse(localStorage.getItem(_PACK_KEY) || '{}') : {};
// itemState: { "Cat::Item": { packed: bool, qty: number } }
let itemState   = _packRaw.itemState   || {};
// dismissed: Set of keys the user deleted from suggestions
let dismissed   = new Set(_packRaw.dismissed   || []);
// customItems: { category: [name, ...] }  — user-added
let customItems = _packRaw.customItems || {};
// finished: user tapped "Finish Packing" — list view collapses to packed-only
let finished    = _packRaw.finished || false;

function saveState() {
    if (!_PACK_KEY) return;
    /* totalSuggested lets other pages (dashboard widget, notifications)
       show accurate packing progress without needing the full ITEM_DB
       suggestion engine loaded — they just read this instead of counting
       itemState's own keys, which only ever contains items someone has
       actually clicked (so checking even 1 of 40 suggested items would
       otherwise look like "100% packed"). */
    const state = { itemState, dismissed: [...dismissed], customItems, finished, totalSuggested: getSuggestedKeys().length };
    localStorage.setItem(_PACK_KEY, JSON.stringify(state));
    /* Sync to Supabase via DB layer (debounced inside DB.savePackState) */
    if (typeof DB !== 'undefined' && tripData.id) {
        DB.savePackState(tripData.id, state);
    }
}

// ── Header ──
document.getElementById('packingListTitle').textContent = destination + ' – Packing List';
const metaParts = [];
if (fromDate && toDate) metaParts.push(`${formatDate(fromDate)} – ${formatDate(toDate)}`);
if (days)               metaParts.push(`${days} day${days !== 1 ? 's' : ''}`);
metaParts.push(`${travelers} traveler${travelers !== 1 ? 's' : ''}`);
const metaEl = document.getElementById('packingSummaryMeta');
if (metaEl) metaEl.textContent = metaParts.join(' · ');

// ── Profile badge ──
const profileBadges = [];
function _act(img, label) {
    return `<span class="pb-chip"><img class="pb-icon" src="img/${img}" alt="">${label}</span>`;
}
function _txt(label) {
    return `<span class="pb-chip pb-chip--weather">${label}</span>`;
}
if (profile.hot)             profileBadges.push(_act('weather_warm.png',  'Warm'));
if (profile.cold)            profileBadges.push(_act('weather_cold.png',  'Cold'));
if (profile.snowy)           profileBadges.push(_act('weather_snowy.png', 'Snowy'));
if (profile.rainy)           profileBadges.push(_act('weather_rainy.png', 'Rainy'));
if (profile.windy)           profileBadges.push(_act('weather_windy.png', 'Windy'));
if (profile.beach)           profileBadges.push(_act('activity_beach.png',       'Beach'));
if (profile.ski)             profileBadges.push(_act('activity_snowsports.png',  'Ski'));
if (profile.hiking)          profileBadges.push(_act('activity_hiking.png',      'Hiking'));
if (profile.camping)         profileBadges.push(_act('activity_camping.png',     'Camping'));
if (profile.swimming)        profileBadges.push(_act('activity_swimming.png',    'Swimming'));
if (profile.gym)             profileBadges.push(_act('activity_gym.png',         'Gym'));
if (profile.business)        profileBadges.push(_act('activity_business.png',    'Business'));
if (profile.nightOut)        profileBadges.push(_act('activity_nightout.png',    'Night Out'));
if (profile.baby)            profileBadges.push(_act('activity_baby.png',        'Baby'));
if (profile.themePark)       profileBadges.push(_act('activity_themepark.png',   'Theme Park'));
if (profile.festival)        profileBadges.push(_act('activity_festival.png',    'Festival'));
if (profile.roadTrip)        profileBadges.push(_act('activity_roadtrip.png',    'Road Trip'));
if (profile.citySightseeing) profileBadges.push(_act('activity_sightseeing.png', 'Sightseeing'));
if (profile.dining)          profileBadges.push(_act('activity_dining.png',      'Dining'));
if (profile.cruise)          profileBadges.push(_act('activity_cruise.png',      'Cruise'));

// ── Count helpers ──
// ALWAYS_SUGGEST_CATS provided by lib/packing-items.js

function getSuggestedKeys() {
    return getSuggestedItemKeys({ profile, userGender, dismissed, customItems });
}

function updateCounts() {
    const all    = getSuggestedKeys();
    const packed = all.filter(k => itemState[k]?.packed).length;
    const left   = all.length - packed;
    // Percentage is based on all suggested keys (profile-matched, not dismissed)
    // but we also factor in dismissed count so artificially small lists don't show 100%
    const dismissedSuggestedCount = (() => {
        let n = 0;
        Object.entries(ITEM_DB).forEach(([cat, items]) => {
            items.forEach(item => {
                if (item.suggest(profile, userGender) && dismissed.has(getItemKey(cat, item.name))) n++;
            });
        });
        return n;
    })();
    const totalForPct = all.length + dismissedSuggestedCount;
    const pct = PackingMath.calcPackedPct(packed, totalForPct);

    const packedEl   = document.getElementById('packedCount');
    const totalEl    = document.getElementById('totalCount');
    const unpackedEl = document.getElementById('unpackedCount');
    const fillEl     = document.getElementById('progressFill');
    const pctEl      = document.getElementById('progressPct');

    if (packedEl)   packedEl.textContent   = packed;
    if (totalEl)    totalEl.textContent    = all.length;
    if (unpackedEl) unpackedEl.textContent = left;
    if (fillEl)     fillEl.style.width     = pct + '%';
    if (pctEl)      pctEl.textContent      = pct + '%';

    // Show dismissed bar when items have been hidden
    const dismissedBar = document.getElementById('dismissedBar');
    const dismissedCountEl = document.getElementById('dismissedCount');
    if (dismissedBar) {
        if (dismissedSuggestedCount > 0) {
            dismissedBar.style.display = 'block';
            if (dismissedCountEl) dismissedCountEl.textContent = dismissedSuggestedCount;
        } else {
            dismissedBar.style.display = 'none';
        }
    }

    // Finish banner: only show when all ACTIVE items are packed
    const finishEl  = document.getElementById('finishPackingBanner');
    const titleEl   = document.getElementById('finishBannerTitle');
    const subEl     = document.getElementById('finishBannerSub');
    const btnEl     = document.getElementById('finishBannerBtn');
    if (finishEl) {
        const allActivePacked = all.length > 0 && left === 0;
        finishEl.classList.toggle('pl-finish-banner--visible', allActivePacked);
        if (allActivePacked && dismissedSuggestedCount > 0) {
            if (titleEl) titleEl.textContent = 'All visible items packed!';
            if (subEl)   subEl.textContent   = `${dismissedSuggestedCount} item${dismissedSuggestedCount !== 1 ? 's' : ''} still hidden — restore to review`;
            if (btnEl) { btnEl.textContent = 'Restore hidden'; btnEl.onclick = restoreDismissed; }
        } else {
            if (titleEl) titleEl.textContent = "You're all packed!";
            if (subEl)   subEl.textContent   = 'Every item on your list is checked off';
            if (btnEl) { btnEl.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg> Back to Trip'; btnEl.onclick = () => location.href = 'tripPreview.html'; }
        }
    }

    if (_PACK_KEY) {
        try {
            const raw = JSON.parse(localStorage.getItem(_PACK_KEY) || '{}');
            raw.suggestedTotal  = all.length;
            raw.totalSuggested  = totalForPct; // full count (includes dismissed)
            localStorage.setItem(_PACK_KEY, JSON.stringify(raw));
        } catch(e) {}
    }
    updateFinishBar(packed, all.length);
    _broadcastState();
}

// ── Finish Packing ──
function updateFinishBar(packedCount, totalCount) {
    const bar   = document.getElementById('finishFixedBar');
    const title = document.getElementById('finishFixedTitle');
    const sub   = document.getElementById('finishFixedSub');
    const label = document.getElementById('finishFixedBtnLabel');
    if (!bar) return;

    bar.classList.toggle('pl-finish-fixed-bar--done', finished);
    if (finished) {
        if (title) title.textContent = 'Packing complete ✓';
        if (sub)   sub.textContent   = `${packedCount} item${packedCount !== 1 ? 's' : ''} packed — edit anytime if you forgot something`;
        if (label) label.textContent = 'Edit List';
    } else {
        if (title) title.textContent = 'Ready to finish?';
        if (sub)   sub.textContent   = `${packedCount} of ${totalCount} packed — lock in your progress`;
        if (label) label.textContent = 'Finish Packing';
    }

    // Editing controls (filters, search, add item) only make sense while
    // actively packing — once finished the list is a read-mostly packed-only
    // summary, and "Edit List" is the way back into full editing mode.
    const controls = document.querySelector('.pl-controls');
    const addBtn   = document.getElementById('openAddItemModal');
    if (controls) controls.style.display = finished ? 'none' : '';
    if (addBtn)   addBtn.style.display   = finished ? 'none' : '';
}

function setFinished(val) {
    finished = val;
    saveState();
    renderList();
    updateCounts();
}

document.getElementById('finishPackingBtn')?.addEventListener('click', () => setFinished(!finished));

function restoreDismissed() {
    dismissed.clear();
    saveState();
    renderList();
    updateCounts();
}

// ── Render ──
let currentFilter  = 'all';
let showAllItems   = false;
let currentSearch  = '';

// PACKING_ICONS, CAT_FALLBACK_ICONS, getItemIcon — see packing-icons.js


function buildItemRow(cat, name, isCustom) {
    const key    = getItemKey(cat, name);
    const state  = itemState[key] || { packed: false, qty: 1 };
    const packed = state.packed;

    const article = document.createElement('article');
    article.className = `packing-item${packed ? ' packing-item--packed' : ''}`;
    article.dataset.status = packed ? 'packed' : 'not-packed';

    const iconSvg = getItemIcon(name, cat, userGender);
    const itemGender = isCustom ? null : (getItemGender(cat, name) || getIconGenderMark(name, userGender));
    const iconStyle = itemGender === 'male'
        ? ' style="background:rgba(59,130,246,0.12);border-color:rgba(59,130,246,0.25);"'
        : itemGender === 'female'
        ? ' style="background:rgba(236,72,153,0.1);border-color:rgba(236,72,153,0.22);"'
        : '';
    const genderBadge = itemGender === 'male'
        ? '<span class="pl-gender-badge pl-gender-badge--male">♂</span>'
        : itemGender === 'female'
        ? '<span class="pl-gender-badge pl-gender-badge--female">♀</span>'
        : '';
    article.innerHTML = `
        <button class="packing-check${packed ? ' packing-check--checked' : ''}" aria-label="${packed ? 'Mark as not packed' : 'Mark as packed'}"></button>
        <div class="pl-item-icon-wrap"${iconStyle}>${iconSvg}</div>
        <div class="packing-item-content">
            <div class="packing-item-top">
                <h3 class="packing-item-name" style="${packed ? 'text-decoration:line-through;color:#99a8b4;' : ''}">${name}</h3>
                <div style="display:flex;align-items:center;gap:5px;">
                    <button class="qty-btn" data-key="${key}" data-delta="-1" style="width:18px;height:18px;border-radius:50%;border:1px solid #cdd6de;background:#f7fafc;cursor:pointer;font-size:0.75rem;display:inline-flex;align-items:center;justify-content:center;padding:0;flex-shrink:0;">−</button>
                    <span class="packing-quantity qty-display" data-key="${key}">x${state.qty}</span>
                    <button class="qty-btn" data-key="${key}" data-delta="1" style="width:18px;height:18px;border-radius:50%;border:1px solid #cdd6de;background:#f7fafc;cursor:pointer;font-size:0.75rem;display:inline-flex;align-items:center;justify-content:center;padding:0;flex-shrink:0;">+</button>
                    <button class="dismiss-btn" data-key="${key}" data-cat="${cat}" data-name="${name}" title="Delete item" style="width:18px;height:18px;border-radius:50%;border:none;background:#fdecea;cursor:pointer;font-size:0.7rem;display:inline-flex;align-items:center;justify-content:center;padding:0;flex-shrink:0;color:#c0392b;">✕</button>
                </div>
            </div>
            <div class="packing-item-meta">
                ${genderBadge}<span class="packing-tag">${cat}</span>
                <span class="packing-status ${packed ? 'packing-status--packed' : 'packing-status--not-packed'}">${packed ? 'Packed' : 'Unpacked'}</span>
            </div>
        </div>`;

    // Toggle packed
    article.querySelector('.packing-check').addEventListener('click', () => {
        const cur = itemState[key] || { packed: false, qty: 1 };
        cur.packed = !cur.packed;
        itemState[key] = cur;
        saveState();
        renderList();
        updateCounts();
        // Trigger milestone notifications after state changes
        if (window.Notify) setTimeout(() => Notify.checkTrip(), 0);
        if (window.BadgeLevels) setTimeout(() => BadgeLevels.checkBadgeLevelUp(), 0);
    });

    // Qty buttons
    article.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            const cur = itemState[btn.dataset.key] || { packed: false, qty: 1 };
            cur.qty = Math.max(1, (cur.qty || 1) + parseInt(btn.dataset.delta));
            itemState[btn.dataset.key] = cur;
            saveState();
            document.querySelectorAll(`.qty-display[data-key="${btn.dataset.key}"]`)
                .forEach(el => el.textContent = `x${cur.qty}`);
        });
    });

    // Dismiss (delete) button (not shown for Essentials / Electronics)
    const dismissBtn = article.querySelector('.dismiss-btn');
    if (!dismissBtn) return article;
    dismissBtn.addEventListener('click', e => {
        e.stopPropagation();
        const k = e.currentTarget.dataset.key;
        dismissed.add(k);
        // Also remove from custom items if it was custom
        const cat2  = e.currentTarget.dataset.cat;
        const name2 = e.currentTarget.dataset.name;
        if (customItems[cat2]) {
            customItems[cat2] = customItems[cat2].filter(n => n !== name2);
            if (!customItems[cat2].length) delete customItems[cat2];
        }
        saveState();
        renderList();
        updateCounts();
    });

    return article;
}

function buildCategorySection(cat, itemEntries) {
    // itemEntries: [{ name, isSuggested }]
    const filtered = itemEntries.filter(({ name, isSuggested }) => {
        if (currentSearch) {
            if (!name.toLowerCase().includes(currentSearch)) return false;
        } else {
            if (!isSuggested && !showAllItems) return false;
        }
        const key    = getItemKey(cat, name);
        const packed = itemState[key]?.packed || false;
        if (finished) return packed;
        if (currentFilter === 'packed')     return packed;
        if (currentFilter === 'not-packed') return !packed;
        return true;
    });
    if (!filtered.length) return null;

    const section = document.createElement('div');
    section.className = 'packing-category-section';

    const hasSuggested = filtered.some(e => e.isSuggested);
    section.innerHTML = `
        <div class="packing-category-header">
            ${hasSuggested ? '<span class="suggested-dot"></span>' : ''}
            ${cat}
            ${hasSuggested ? '<span class="packing-suggested-badge">✨ Suggested</span>' : ''}
        </div>`;

    filtered.forEach(({ name }) => {
        const row = buildItemRow(cat, name, false);
        section.appendChild(row);
    });
    return section;
}

// Render the "Adapted for your trip" banner once into its stable container
(function initProfileBanner() {
    const wrap = document.getElementById('profileBannerWrap');
    if (!wrap || !profileBadges.length) return;
    wrap.innerHTML = `<div class="packing-suggested-banner"><span class="pb-title">Adapted for your trip</span><div class="pb-badges">${profileBadges.join('')}</div></div>`;
})();

function renderList() {
    currentSearch = (document.getElementById('plSearch')?.value || '').toLowerCase().trim();
    const body = document.getElementById('packingListBody');
    body.innerHTML = '';

    // Build per-category entries
    const seenSuggestedNames = new Set();
    Object.entries(ITEM_DB).forEach(([cat, dbItems]) => {
        const entries = dbItems
            .filter(item => {
                if (!item.suggest(_ALL_P, userGender)) return false;
                const key = getItemKey(cat, item.name);
                // Essentials & Electronics always count as suggested even if dismissed
                const alwaysCat = ALWAYS_SUGGEST_CATS.has(cat);
                const isSugg = item.suggest(profile, userGender) && (!dismissed.has(key) || alwaysCat);
                if (!isSugg) return showAllItems || !!currentSearch;
                // Deduplicate suggested items by name across categories
                const normName = item.name.toLowerCase().trim();
                if (seenSuggestedNames.has(normName)) return false;
                seenSuggestedNames.add(normName);
                return true;
            })
            .map(item => ({
                name: item.name,
                isSuggested: item.suggest(profile, userGender) && (!dismissed.has(getItemKey(cat, item.name)) || ALWAYS_SUGGEST_CATS.has(cat))
            }));

        if (!entries.length) return;

        // For non-suggested items shown via "show all", mark them
        const section = buildCategorySection(cat, entries);
        if (section) body.appendChild(section);
    });

    // Custom-added items
    Object.entries(customItems).forEach(([cat, names]) => {
        if (!names.length) return;
        const section = document.createElement('div');
        section.className = 'packing-category-section';
        section.innerHTML = `<div class="packing-category-header">${cat} <span style="font-size:0.6rem;font-weight:500;color:#5f9d30;text-transform:none;letter-spacing:0;">custom</span></div>`;
        names.forEach(name => {
            if (currentSearch && !name.toLowerCase().includes(currentSearch)) return;
            const key    = getItemKey(cat, name);
            const packed = itemState[key]?.packed || false;
            if (finished && !packed) return;
            if (currentFilter === 'packed'     && !packed) return;
            if (currentFilter === 'not-packed' && packed)  return;
            section.appendChild(buildItemRow(cat, name, true));
        });
        if (section.children.length > 1) body.appendChild(section);
    });

    // "Show all / Fewer items" toggle (not relevant once packing is finished)
    if (!finished) {
        const toggle = document.createElement('button');
        toggle.style.cssText = 'margin:16px auto 4px;display:block;background:none;border:1px solid #cdd6de;border-radius:999px;padding:6px 18px;font-size:0.78rem;cursor:pointer;color:#4b5a66;font-family:inherit;';
        toggle.textContent = showAllItems ? '↑ Show suggested items only' : '↓ Browse all items';
        toggle.addEventListener('click', () => {
            showAllItems = !showAllItems;
            renderList();
        });
        body.appendChild(toggle);
    }
}

// ── Filters ──
document.querySelectorAll('.pl-filter, .packing-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.pl-filter, .packing-filter-btn').forEach(b => {
            b.classList.remove('active', 'packing-filter-btn--active');
        });
        btn.classList.add('active', 'packing-filter-btn--active');
        currentFilter = btn.dataset.filter;
        renderList();
    });
});

// ── Search filter ──
const plSearch = document.getElementById('plSearch');
if (plSearch) {
    plSearch.addEventListener('input', () => renderList());
}

// ── Add item modal ──
const modal = document.getElementById('addItemModal');
document.getElementById('openAddItemModal').addEventListener('click', () => {
    modal.classList.add('is-visible');
    modal.setAttribute('aria-hidden', 'false');
});
document.getElementById('closeAddItemModal').addEventListener('click', closeModal);
document.getElementById('cancelAddItem').addEventListener('click', e => { e.preventDefault(); closeModal(); });

function closeModal() {
    modal.classList.remove('is-visible');
    modal.setAttribute('aria-hidden', 'true');
}

document.getElementById('addItemForm').addEventListener('submit', e => {
    e.preventDefault();
    const name     = document.getElementById('newItemName').value.trim();
    const category = document.getElementById('newItemCategory').value;
    const qty      = parseInt(document.getElementById('newItemQty').value) || 1;
    if (!name) return;

    // Check if it's already in ITEM_DB and just dismissed — un-dismiss instead
    const key    = getItemKey(category, name);
    const inDB   = ITEM_DB[category]?.some(i => i.name === name);
    if (inDB) {
        dismissed.delete(key);   // restore suggestion
    } else {
        if (!customItems[category]) customItems[category] = [];
        if (!customItems[category].includes(name)) customItems[category].push(name);
    }
    itemState[key] = { packed: false, qty };
    saveState();
    renderList();
    updateCounts();

    document.getElementById('newItemName').value = '';
    document.getElementById('newItemQty').value  = 1;
    closeModal();
});

// ── Init ──
let _collabChannel   = null;
let _collabTripId    = null;
let _syncInProgress  = false;
renderList();
updateCounts();

// ══════════════════════════════════════════════════════
//  SHARE & COLLAB
// ══════════════════════════════════════════════════════

function _encodeShare() {
    const items = Object.entries(itemState).map(([k, v]) => [k, v.packed ? 1 : 0, v.qty || 1]);
    const payload = {
        v: 1,
        sid:  tripData.id || '',
        dest: tripData.destination || '',
        from: tripData.fromDate    || '',
        to:   tripData.toDate      || '',
        trav: tripData.travelers   || 1,
        by:   (() => { try { return JSON.parse(localStorage.getItem('pm_session') || 'null')?.name || 'A friend'; } catch { return 'A friend'; } })(),
        items,
        custom:    JSON.parse(JSON.stringify(customItems)),
        dismissed: [...dismissed],
    };
    return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
}

function _buildShareUrl() {
    const base = window.location.href.split('?')[0];
    return `${base}?join=${_encodeShare()}`;
}

// Share modal
const shareModal    = document.getElementById('shareModal');
const shareUrlInput = document.getElementById('shareUrl');
const nativeShareBtn = document.getElementById('nativeShareBtn');
if (nativeShareBtn && navigator.share) {
    // Only show this button where the OS actually has a share sheet to
    // offer (AirDrop, Messages, WhatsApp, Telegram, Mail, etc.) — most
    // desktop browsers besides Safari have no navigator.share at all, so
    // "Copy Link" stays the only option there rather than showing a
    // button that would just silently do nothing.
    nativeShareBtn.style.display = 'flex';
    nativeShareBtn.addEventListener('click', async () => {
        try {
            await navigator.share({ title: `${tripData.destination || 'Trip'} Packing List`, text: `Pack together for ${tripData.destination || 'this trip'} on Packmates AI!`, url: shareUrlInput.value });
        } catch {} // user cancelled — not an error
    });
}
document.getElementById('openShareModal').addEventListener('click', () => {
    const url = _buildShareUrl();
    shareUrlInput.value = url;
    document.getElementById('shareCopied').style.display = 'none';
    shareModal.classList.add('is-visible');
});
document.getElementById('closeShareModal').addEventListener('click', () => shareModal.classList.remove('is-visible'));
shareModal.addEventListener('click', e => { if (e.target === shareModal) shareModal.classList.remove('is-visible'); });

document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (modal.classList.contains('is-visible')) closeModal();
    if (shareModal.classList.contains('is-visible')) shareModal.classList.remove('is-visible');
});

document.getElementById('copyShareUrl').addEventListener('click', () => {
    navigator.clipboard.writeText(shareUrlInput.value).then(() => {
        const copied = document.getElementById('shareCopied');
        copied.style.display = 'block';
        setTimeout(() => { copied.style.display = 'none'; }, 2000);
    });
});

// Check for ?join= param on load
(function checkJoinParam() {
    const params = new URLSearchParams(window.location.search);
    const code   = params.get('join');
    if (!code) return;
    try {
        const payload = JSON.parse(decodeURIComponent(escape(atob(code))));
        if (!payload || payload.v !== 1) return;

        const joinBanner = document.getElementById('joinBanner');
        const joinTitle  = document.getElementById('joinTitle');
        const joinSub    = document.getElementById('joinSub');
        const joinAvatar = document.getElementById('joinAvatar');

        if (joinTitle)  joinTitle.textContent = `${payload.dest} Packing List`;
        if (joinSub)    joinSub.textContent   = `Shared by ${payload.by} — join to pack together`;
        if (joinAvatar) joinAvatar.textContent = (payload.by || 'PM').slice(0, 2).toUpperCase();
        if (joinBanner) joinBanner.style.display = 'flex';

        document.getElementById('joinAcceptBtn').addEventListener('click', () => {
            _acceptJoin(payload);
            joinBanner.style.display = 'none';
        });
        document.getElementById('joinDismissBtn').addEventListener('click', () => {
            joinBanner.style.display = 'none';
            // Strip ?join param from URL without reload
            history.replaceState(null, '', window.location.pathname);
        });
    } catch(e) {}
})();

function _acceptJoin(payload) {
    // This creates a NEW trip owned by the recipient, seeded from the
    // sender's shared snapshot — it must NOT reuse payload.sid (the
    // sender's own trip id). Supabase's trips table only allows the
    // owning user_id to write a given id; reusing it would make every
    // recipient's DB.saveTrip() upsert collide with a row they don't own.
    const tripId = 'shared_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    const _esc = s => String(s ?? '').replace(/[<>"'&]/g, c => ({'<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','&':'&amp;'}[c]));
    const newTrip = {
        id:          tripId,
        destination: _esc(payload.dest),
        fromDate:    payload.from,
        toDate:      payload.to,
        travelers:   Math.max(1, Math.min(100, parseInt(payload.trav) || 1)),
        imageUrl:    tripData.imageUrl || '',
    };

    // Merge pack state: remote items take precedence
    const newItemState = {};
    (payload.items || []).forEach(([k, packed, qty]) => {
        newItemState[k] = { packed: !!packed, qty: qty || 1 };
    });

    // Sanitize custom items (category keys + item names) from shared payload
    const rawCustom = payload.custom || {};
    const safeCustom = {};
    Object.entries(rawCustom).forEach(([cat, names]) => {
        const safeCat = _esc(String(cat));
        if (safeCat && Array.isArray(names))
            safeCustom[safeCat] = names.map(n => _esc(String(n))).filter(Boolean);
    });

    // Save trip + pack state to localStorage + Supabase
    const joinPackState = { itemState: newItemState, dismissed: payload.dismissed || [], customItems: safeCustom };
    if (typeof DB !== 'undefined') {
        DB.saveTrip(newTrip);
        DB.savePackState(tripId, joinPackState);
    } else {
        const trips = JSON.parse(localStorage.getItem('pm_trips') || '[]');
        if (!trips.find(t => t.id === tripId)) trips.push(newTrip);
        localStorage.setItem('pm_trips', JSON.stringify(trips));
        localStorage.setItem('currentTrip', JSON.stringify(newTrip));
        localStorage.setItem(`pm_pack_${tripId}`, JSON.stringify(joinPackState));
    }

    // Reload page to pick up the joined trip state
    history.replaceState(null, '', window.location.pathname);
    location.reload();
}

// BroadcastChannel for same-browser cross-tab live sync
(function initCollabSync() {
    const tid = tripData.id;
    if (!tid || typeof BroadcastChannel === 'undefined') return;
    _collabTripId  = tid;
    _collabChannel = new BroadcastChannel(`pm_pl_${tid}`);

    _collabChannel.onmessage = e => {
        const msg = e.data;
        if (!msg) return;

        if (msg.type === 'ping') {
            // Another tab just opened — show collab bar and ping back
            const bar = document.getElementById('collabBar');
            const lbl = document.getElementById('collabLabel');
            if (bar) bar.style.display = 'flex';
            if (lbl) lbl.textContent = 'Packing together';
            try { _collabChannel.postMessage({ type: 'pong' }); } catch(e) {}
        }

        if (msg.type === 'pong') {
            const bar = document.getElementById('collabBar');
            const lbl = document.getElementById('collabLabel');
            if (bar) bar.style.display = 'flex';
            if (lbl) lbl.textContent = 'Packing together';
        }

        if (msg.type === 'state') {
            let changed = false;
            (msg.items || []).forEach(([k, packed, qty]) => {
                const cur = itemState[k] || {};
                if (cur.packed !== !!packed) {
                    itemState[k] = { packed: !!packed, qty: qty || 1 };
                    changed = true;
                }
            });
            if (changed) {
                _syncInProgress = true;
                saveState(); renderList(); updateCounts();
                _syncInProgress = false;
            }
        }
    };

    // Announce presence to other tabs
    try { _collabChannel.postMessage({ type: 'ping' }); } catch(e) {}
})();

function _broadcastState() {
    if (!_collabChannel || _syncInProgress) return;
    const items = Object.entries(itemState).map(([k, v]) => [k, v.packed ? 1 : 0, v.qty || 1]);
    try { _collabChannel.postMessage({ type: 'state', items }); } catch(e) {}
}

// ── Supabase Realtime: live packing collaboration ACROSS devices/users ──
// BroadcastChannel above only ever worked between tabs of the same
// browser on the same device — not real collaboration between two
// different people. Combines postgres_changes (did someone just pack
// something) with Presence (is anyone else actually looking at this
// list right now) on one channel for this trip.
(async function initRealtimeCollab() {
    const tid = tripData.id;
    if (!tid || typeof window._pm_sbLoaded === 'undefined') return;
    const sbClient = await window._pm_sbLoaded;
    if (!sbClient) return;
    const { data: { session } } = await sbClient.auth.getSession();
    if (!session) return;
    const myUserId = session.user.id;

    const AVATAR_COLORS = ['#7cc63e','#4a90d9','#e67e22','#9b59b6','#e74c3c','#1abc9c','#f39c12'];
    const myName = Auth.getSession()?.name || 'You';

    // Presence: who's ACTUALLY here right now, not just "made a change
    // recently" — the two are complementary. Presence answers "is anyone
    // else looking at this list at this moment"; postgres_changes below
    // answers "did someone just pack something".
    function _renderPresence(channel) {
        const state = channel.presenceState();
        const others = Object.values(state).flat().filter(p => p.user_id !== myUserId);
        const bar = document.getElementById('collabBar');
        const lbl = document.getElementById('collabLabel');
        const avatarsEl = document.getElementById('collabAvatars');
        if (!others.length) { if (bar) bar.style.display = 'none'; return; }
        if (bar) bar.style.display = 'flex';
        if (lbl) lbl.textContent = others.length === 1 ? `${others[0].name} is here too` : `${others.length} packmates are here too`;
        if (avatarsEl) {
            avatarsEl.innerHTML = others.slice(0, 4).map((p, i) =>
                `<span style="background:${AVATAR_COLORS[i % AVATAR_COLORS.length]}" title="${p.name}">${(p.name || '?').trim().charAt(0).toUpperCase()}</span>`
            ).join('');
        }
    }

    const channel = sbClient.channel(`packing-state-${tid}`, { config: { presence: { key: myUserId } } })
        .on('postgres_changes', {
            event: '*', schema: 'public', table: 'packing_state',
            filter: `trip_id=eq.${tid}`,
        }, payload => {
            const row = payload.new;
            if (!row || row.user_id === myUserId) return; // ignore our own write echoing back

            let changed = false;
            Object.entries(row.item_state || {}).forEach(([k, v]) => {
                const cur = itemState[k] || {};
                if (cur.packed !== !!v.packed) {
                    itemState[k] = { packed: !!v.packed, qty: v.qty || cur.qty || 1 };
                    changed = true;
                }
            });
            if (changed) {
                _syncInProgress = true;
                saveState(); renderList(); updateCounts();
                _syncInProgress = false;
            }
        })
        .on('presence', { event: 'sync' },  () => _renderPresence(channel))
        .on('presence', { event: 'join' },  () => _renderPresence(channel))
        .on('presence', { event: 'leave' }, () => _renderPresence(channel))
        .subscribe(async status => {
            if (status === 'SUBSCRIBED') {
                await channel.track({ user_id: myUserId, name: myName });
            }
        });
})();

/* ── Supabase background sync: pull fresh pack state, re-render in place if changed ── */
if (!sessionStorage.getItem('pm_pl_synced') && tripData.id) {
    (async () => {
        const before = localStorage.getItem(`pm_pack_${tripData.id}`);
        const changed = await DB.syncPackState(tripData.id);
        if (changed && localStorage.getItem(`pm_pack_${tripData.id}`) !== before) {
            sessionStorage.setItem('pm_pl_synced', '1');
            /* Used to be location.reload() here. On a cold app launch this
               almost always fires (local cache is stale/empty vs. Supabase),
               so it read as the packing page "reloading twice" right after
               opening the app — a full page reload for what's really just
               a data refresh. Apply the freshly-synced state to the same
               in-memory variables the realtime collab handler above already
               updates live, and re-render, instead of reloading. */
            const fresh = JSON.parse(localStorage.getItem(`pm_pack_${tripData.id}`) || '{}');
            itemState   = fresh.itemState   || {};
            dismissed   = new Set(fresh.dismissed || []);
            customItems = fresh.customItems || {};
            renderList();
            updateCounts();
        }
    })().catch(() => {});
}
