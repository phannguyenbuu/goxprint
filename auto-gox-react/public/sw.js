const CACHE_NAME = 'gox-cache-react-v5';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
  // Clear old caches (including previous v1/v2 caches)
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  // Only handle HTTP/HTTPS requests (ignore chrome-extension://, moz-extension://, etc.)
  if (!event.request.url.startsWith('http://') && !event.request.url.startsWith('https://')) {
    return;
  }

  // Only handle GET requests (Cache API does not support POST, PUT, DELETE, etc.)
  if (event.request.method !== 'GET') {
    return;
  }

  // Ignore API calls and local agent calls
  if (event.request.url.includes('127.0.0.1') || 
      event.request.url.includes('localhost') ||
      event.request.url.includes('quanlymay.com') ||
      event.request.url.includes('printagentx.com/api') ||
      event.request.url.includes('/api/')) {
    return;
  }

  // For Vite assets (which have hashes in their filenames like index-D7MF2Z_B.js),
  // they are immutable and safe to Cache First.
  if (event.request.url.includes('/assets/')) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then(response => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone).catch(() => {});
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // For HTML files (like index.html) and everything else, use Network First!
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone).catch(() => {});
          });
        }
        return response;
      })
      .catch(() => {
        // If network fails (offline), fallback to cache
        return caches.match(event.request);
      })
  );
});

