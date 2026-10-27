const CACHE_NAME = "ios-launcher-v7";

// Pre-cache core offline shell assets
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

// Activate event: claim clients and purge all outdated caches immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[SW] Purging old cache:", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event: Network-First strategy with fallback to Cache
// This guarantees instant deployment updates while preserving 100% offline capability
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (!event.request.url.startsWith("http")) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return networkResponse;
      })
      .catch(async () => {
        // Offline mode: match from local cache
        const cached = await caches.match(event.request);
        if (cached) return cached;

        // Fallback for document navigation
        if (event.request.mode === "navigate") {
          return caches.match(self.registration.scope);
        }
      })
  );
});
