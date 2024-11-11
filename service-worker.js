self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('my-cache').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/script.js',
        '/images/icon-192x192.png',
        '/images/icon-512x512.png'
      ]);
    })
  );
});

// Activate event - Clean up old caches (optional, but recommended)
self.addEventListener('activate', event => {
  const cacheWhitelist = ['my-cache'];  // List of caches to keep
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);  // Delete old caches
          }
        })
      );
    })
  );
});

// Fetch event - Serve cached resources when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // If the requested resource is found in cache, return it
        return cachedResponse;
      }
      
      // If not in cache, make a network request
      return fetch(event.request).then(networkResponse => {
        // Optionally, cache the new resource for future use
        if (event.request.method === 'GET' && networkResponse && networkResponse.status === 200) {
          caches.open('my-cache').then(cache => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => {
        // Optionally, handle offline cases for specific types of requests (e.g., images)
        // For now, just return a fallback HTML page if the network fails
        if (event.request.url.endsWith('.html')) {
          return caches.match('/index.html'); // Return a fallback HTML page if offline
        }
      });
    })
  );
});