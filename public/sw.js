const CACHE_NAME = "ios-launcher-offline-v5";

// Install event: cache current shell assets relative to service worker scope
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      const scope = self.registration.scope;
      const assetsToCache = [
        scope,
        `${scope}manifest.json`,
        `${scope}manifest.webmanifest`,
        `${scope}icon-192.png`,
        `${scope}icon-512.png`,
        `${scope}apple-touch-icon.png`,
        `${scope}apple-touch-icon-precomposed.png`,
        `${scope}icon.svg`
      ];

      for (const asset of assetsToCache) {
        try {
          await cache.add(asset);
        } catch (err) {
          console.warn("[SW] Cache preload warning for asset:", asset, err);
        }
      }
    }).then(() => self.skipWaiting())
  );
});

// Activate event: claim clients and purge older caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event: Cache-First strategy with background revalidation for offline PWA
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  // Only handle http / https requests
  if (!event.request.url.startsWith("http")) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return from local cache immediately, fetch fresh copy in background if online
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          })
          .catch(() => {
            // Offline - no network, cached response was already served
          });
        return cachedResponse;
      }

      // If not in cache, fetch from network and dynamically cache for future offline launches
      return fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback to cached root shell if navigation request
          if (event.request.mode === "navigate") {
            return caches.match(self.registration.scope);
          }
        });
    })
  );
});
