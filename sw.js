const CACHE_NAME = 'taller-pwa-v1';
const urlsToCache = [
  './index.html',
  './manifest.json'
];

// Instalación del Service Worker y guardado en Caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar peticiones para responder más rápido
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

// Limpieza de cachés antiguas
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

// --- NUEVO: Manejo de clics en las notificaciones Push ---
self.addEventListener('notificationclick', event => {
  event.notification.close(); // Cierra la notificación
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // Si la app ya está abierta en alguna pestaña, la trae al frente (focus)
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.indexOf('/') !== -1 && 'focus' in client) {
          return client.focus();
        }
      }
      // Si la app está cerrada, abre una nueva ventana principal
      if (clients.openWindow) {
        return clients.openWindow('./index.html');
      }
    })
  );
});
