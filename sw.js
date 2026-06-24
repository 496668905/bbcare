const CACHE_NAME = "baby-english-v19";
const ASSETS = [
  "./",
  "./index.html",
  "./story.html",
  "./adult.html",
  "./adult-game.html",
  "./adult-game.css",
  "./adult-game.js",
  "./adult-game-b.html",
  "./adult-game-b.css",
  "./adult-game-b.js",
  "./coach.html",
  "./coach.css",
  "./coach.js",
  "./coach-scenes.json",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./icon-192.svg",
  "./icon-512.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(event.request).then((networkRes) => {
        const copy = networkRes.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return networkRes;
      });
    })
  );
});
