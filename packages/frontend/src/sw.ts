import { precacheAndRoute } from "workbox-precaching";

declare const self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response right after it's received
        const clonedResponse = response.clone();
        // Use the cloned response to update the cache
        caches
          .open("api-cache")
          .then((cache) => cache.put(event.request, clonedResponse));

        // Return the original response to the fetch event
        return response;
      })
      .catch(() => {
        // If the network request fails, try to return a response from the cache.
        return caches.match(event.request).then((cacheResponse) => {
          return cacheResponse || new Response("No response found in cache.");
        });
      })
  );
});
