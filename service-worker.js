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
  // Ignore crossdomain requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  // Ignore non-GET requests
  if (event.request.method !== "GET") {
    return;
  }
  // Ignore browser-sync
  if (event.request.url.indexOf("browser-sync") > -1) {
    return;
  }
  console.log(event);
  // Tell the fetch to respond with this chain
  event.respondWith(
    // Open the cache
    caches.open(CACHE_NAME).then((cache) => {
      // Look for matching request in the cache
      return cache.match(event.request).then((matched) => {
        // If a match is found return the cached version first
        if (matched) {
          return matched;
        }
        // Otherwise continue to the network
        return fetch(event.request).then((response) => {
          // Cache the response
          cache.put(event.request, response.clone());
          // Return the original response to the page
          return response;
        });
      });
    })
  );
});
