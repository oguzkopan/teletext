// Service Worker for Modern Teletext
// Implements offline support and cache fallback
// Requirements: 13.4, 15.3

const CACHE_NAME = 'teletext-cache-v1';
const API_CACHE_NAME = 'teletext-api-cache-v1';

// Static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/favicon.ico'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME && name !== API_CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - implement cache-first strategy for API calls
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle API requests with network-first, fallback to cache
  if (url.pathname.startsWith('/api/page/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone the response before caching
          const responseToCache = response.clone();
          
          caches.open(API_CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          
          return response;
        })
        .catch(() => {
          // Network failed, try cache
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              // Add a header to indicate this is from cache
              const headers = new Headers(cachedResponse.headers);
              headers.set('X-Cache-Status', 'cached');
              
              return cachedResponse.blob().then((blob) => {
                return new Response(blob, {
                  status: cachedResponse.status,
                  statusText: cachedResponse.statusText,
                  headers: headers
                });
              });
            }
            
            // No cache available, return offline page
            return new Response(
              JSON.stringify({
                success: false,
                error: 'offline',
                message: 'No network connection and no cached version available'
              }),
              {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
              }
            );
          });
        })
    );
    return;
  }
  
  // For other requests, use cache-first strategy
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(request).then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200) {
            return response;
          }
          
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          
          return response;
        });
      })
  );
});

// Message event - handle cache management commands
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => caches.delete(name))
        );
      })
    );
  }
  
  if (event.data && event.data.type === 'CACHE_PAGE') {
    const { pageId, pageData } = event.data;
    event.waitUntil(
      caches.open(API_CACHE_NAME).then((cache) => {
        const request = new Request(`/api/page/${pageId}`);
        const response = new Response(JSON.stringify(pageData), {
          headers: { 'Content-Type': 'application/json' }
        });
        return cache.put(request, response);
      })
    );
  }
});
