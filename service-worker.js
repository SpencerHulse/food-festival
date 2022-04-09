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

// Cache resources
// Use self because service workers run before the window object is created
// Self refers to the service worker object
self.addEventListener("install", function (e) {
  // Waits until work is complete to terminate the service worker
  e.waitUntil(
    // caches.open finds a cache by name
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("installing cache : " + CACHE_NAME);
      // Adds everything in FILES_TO_CACHE to the opened cache
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Clear out old cache data
self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      let cacheKeepList = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });

      cacheKeepList.push(CACHE_NAME);

      // Promise that resolves when all old versions of the cache are deleted
      return Promise.all(
        keyList.map(function (key, i) {
          if (cacheKeepList.indexOf(key) === -1) {
            console.log(`deleting cache : ${keyList[i]}`);
            return caches.delete(keyList[i]);
          }
        })
      );
    })
  );
});
