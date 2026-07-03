const CACHE = 'packmates-v1';

const PRECACHE = [
  '/welcome.html',
  '/login.html',
  '/signup.html',
  '/reset.html',
  '/index.html',
  '/auth.js',
  '/style.css',
  '/styles.css',
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

  /* Pass through: non-GET, cross-origin API (Supabase, Anthropic, Pexels, weather) */
  if (request.method !== 'GET') return;
  if (url.hostname !== self.location.hostname) return;

  /* Network-first for our own API routes */
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

  /* Cache-first for everything else (HTML, JS, CSS, fonts, images) */
  e.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(request, clone));
        }
        return res;
      });
    })
  );
});
