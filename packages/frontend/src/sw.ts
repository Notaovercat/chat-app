import { precacheAndRoute } from "workbox-precaching";

declare const self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    event.respondWith(fetch(event.request));
    return;
  }
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clonedResponse = response.clone();
        caches
          .open("api-cache")
          .then((cache) => cache.put(event.request, clonedResponse));
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cacheResponse) => {
          return cacheResponse || new Response("No response found in cache.");
        });
      })
  );
});

self.addEventListener("push", function (event) {
  const payload = event.data ? event.data.text() : "no payload";
  const data = JSON.parse(payload);
  const title = data.title;
  event.waitUntil(
    self.registration.showNotification(title, {
      body: data.body,
      icon: "./iconpng.ico",
    })
  );
});
