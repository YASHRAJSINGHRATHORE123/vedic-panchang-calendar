const CACHE_NAME = 'panchang-cache-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/src/app.js',
  '/src/data/config.js',
  '/src/engines/astronomyEngine.js',
  '/src/engines/panchangEngine.js',
  '/src/engines/festivalEngine.js',
  '/src/engines/muhuratEngine.js',
  '/src/engines/horoscopeEngine.js',
  '/src/engines/pdfEngine.js',
  '/src/engines/aiEngine.js',
  '/src/ui/calendarUI.js',
  '/src/ui/panchangUI.js',
  '/src/ui/aiUI.js',
  '/src/ui/horoscopeUI.js',
  '/src/ui/pdfUI.js',
  '/src/utils/dateUtils.js',
  '/src/utils/locationUtils.js'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
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
