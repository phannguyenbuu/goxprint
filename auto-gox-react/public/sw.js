const CACHE_NAME = 'gox-cache-react-v1';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
  // Clear old caches (including the old 'gox-cache-vX' from the Vanilla JS version)
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
  // Ignore API calls and local agent calls
  if (event.request.url.includes('127.0.0.1') || 
      event.request.url.includes('localhost') ||
      event.request.url.includes('api.quanlymay.com')) {
    return;
  }

  // For Vite assets (which have hashes in their filenames like index-D7MF2Z_B.js),
  // they are immutable and safe to Cache First.
  if (event.request.url.includes('/assets/')) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then(response => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
    return;
  }

  // For HTML files (like index.html) and everything else, use Network First!
  // This ensures that when we deploy a new version, the browser ALWAYS fetches
  // the newest index.html, which contains the links to the new hashed assets.
  // NO MORE Ctrl + F5 REQUIRED!
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache the newest response
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // If network fails (offline), fallback to cache
        return caches.match(event.request);
      })
  );
});
