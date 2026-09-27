const CACHE = 'packmates-v4';

const PRECACHE = [
  '/img/appIcon.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const { request } = e;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;
  if (url.hostname !== self.location.hostname) return;

  /* API routes: network-only */
  if (url.pathname.startsWith('/api/')) {
    e.respondWith(
      fetch(request).catch(() =>
        new Response(JSON.stringify({ error: 'You are offline.' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    );
    return;
  }

  /* HTML, JS, CSS: network-first so updates are always reflected */
  const ext = url.pathname.split('.').pop().toLowerCase();
  if (['html', 'js', 'css'].includes(ext) || url.pathname === '/') {
    e.respondWith(
      fetch(request)
        .then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(request, clone));
          }
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  /* Static assets (images, fonts, videos): stale-while-revalidate - serve
     the cached copy instantly if there is one (same speed as pure
     cache-first), but always also re-fetch in the background and update
     the cache for next time. Plain cache-first here meant a changed
     asset (e.g. swapping a packing-item icon) stayed stuck on whatever
     got cached on a person's first visit *forever*, with no way for
     them to self-fix it (a browser hard-refresh doesn't touch Cache
     Storage, only bumping CACHE above does) - this fixes that without
     giving up the instant-from-cache speed for the common case. */
  e.respondWith(
    caches.match(request).then(cached => {
      const fetchPromise = fetch(request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(request, clone));
        }
        return res;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
