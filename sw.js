const CACHE_NAME = 'taller-pwa-v1';
const urlsToCache = [
  './index.html',
  './manifest.json'
  // Nota: Las librerías de CDN como Tailwind o Supabase no las cacheamos aquí 
  // para evitar problemas de cuota o actualizaciones obsoletas.
];

// Instalación del Service Worker y guardado en Caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Archivos en caché guardados');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar peticiones para responder más rápido
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devuelve el archivo desde caché si existe
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Limpieza de cachés antiguas si actualizamos la versión de la app
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
