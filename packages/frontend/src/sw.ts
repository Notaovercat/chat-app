import { precacheAndRoute } from "workbox-precaching";

declare const self: ServiceWorkerGlobalScope;

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("install", (event) => {
  console.log("Service Worker installed");
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
  console.log("Service Worker activated");
});

// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     (async function () {
//       const cacheName = "api-cache";
//       const cache = await caches.open(cacheName);
//       const cachedResponse = await cache.match(event.request);

//       const fetchPromise = fetch(event.request);

//       event.waitUntil(
//         (async function () {
//           const networkResponse = await fetchPromise;
//           const cacheControlHeader =
//             networkResponse.headers.get("Cache-Control");

//           if (cacheControlHeader && cacheControlHeader.includes("no-cache")) {
//             // If the response indicates no-cache, delete the existing cache entry
//             await cache.delete(event.request);
//           } else {
//             // Otherwise, update the cache with the new response
//             await cache.put(event.request, networkResponse.clone());
//           }
//         })()
//       );

//       // Return the cached response if available, otherwise return the network response.
//       return cachedResponse || fetchPromise;
//     })()
//   );
// });

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cache = await caches.open("api-cache");
        const cachedResponse = await cache.match("/offline.html");
        return (
          cachedResponse ||
          new Response("Offline", { status: 503, statusText: "Offline" })
        );
      })
    );
  } else {
    event.respondWith(
      (async function () {
        const cache = await caches.open("api-cache");
        const cachedResponse = await cache.match(event.request);
        const networkResponsePromise = fetch(event.request);

        event.waitUntil(
          (async function () {
            const networkResponse = await networkResponsePromise;
            await cache.put(event.request, networkResponse.clone());
          })()
        );

        // Returned the cached response if we have one, otherwise return the network response.
        return cachedResponse || networkResponsePromise;
      })()
    );
  }
});

precacheAndRoute(self.__WB_MANIFEST);
