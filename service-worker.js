const CACHE_NAME = 'panchang-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/src/app.js',
  '/src/data/config.js',
  '/src/engines/astronomyEngine.js',
  '/src/engines/panchangEngine.js',
  '/src/engines/festivalEngine.js',
  '/src/engines/aiEngine.js',
  '/src/ui/calendarUI.js',
  '/src/ui/panchangUI.js',
  '/src/ui/aiUI.js',
  '/src/utils/dateUtils.js',
  '/src/utils/locationUtils.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
