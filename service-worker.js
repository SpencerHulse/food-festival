const APP_PREFIX = "FoodEvent-";
const VERSION = "version_01";
const CACHE_NAME = APP_PREFIX + VERSION;
const FILES_TO_CACHE = [
  "./index.html",
  "./events.html",
  "./tickets.html",
  "./schedule.html",
  "./assets/css/style.css",
  "./assets/css/bootstrap.css",
  "./assets/css/tickets.css",
  "./dist/app.bundle.js",
  "./dist/events.bundle.js",
  "./dist/tickets.bundle.js",
  "./dist/schedule.bundle.js",
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    // Add files to the cache
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log(`Installing cache : ${CACHE_NAME}`);
        return cache.addAll(FILES_TO_CACHE);
      })
      .then(self.skipWaiting())
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    // Gets the keys in cache and filters it for this apps keys
    caches.keys().then((keyList) => {
      let cacheKeepList = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });

      // Push the new files to the cacheKeepList
      cacheKeepList.push(CACHE_NAME);

      // Promise that only resolves when old version of the cache is deleted
      return Promise.all(
        keyList.map(function (key, i) {
          if (cacheKeepList.indexOf(key) === -1) {
            console.log(`Deleting cache : ${keyList[i]}`);
            return caches.delete(keyList[i]);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      let networked = fetch(event.request)
        .then(fetchedFromNetwork, unableToResolve)
        .catch(unableToResolve);
      return cached || networked;

      function fetchedFromNetwork(response) {
        let cacheCopy = response.clone();

        caches
          .open(CACHE_NAME)
          .then(function add(cache) {
            cache.put(event.request, cacheCopy);
          })
          .then(function () {
            console.log(`Fetch response stored in cache`);
          });
        return response;
      }

      function unableToResolve() {
        return new Response(`<h1>Service Unavailable</h1>`, {
          status: 503,
          statusText: "Service Unavailable",
          headers: new Headers({ "content-Type": "text/plain" }),
        });
      }
    })
  );
});
