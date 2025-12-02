// Service Worker for Photo Portfolio - Instant Caching
const CACHE_NAME = 'photo-portfolio-v1';
const IMAGE_CACHE = 'photo-portfolio-images-v1';

// Install - activate immediately
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  self.skipWaiting(); // Activate immediately
});

// Activate - claim all clients immediately
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all pages immediately
      self.clients.claim()
    ])
  );
});

// Fetch - cache images aggressively
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Handle images with aggressive caching (cache-first strategy)
  if (
    request.destination === 'image' ||
    url.hostname.includes('cloudinary.com') ||
    url.pathname.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)
  ) {
    event.respondWith(handleImageRequest(request));
    return;
  }

  // Handle other assets (JS, CSS) with network-first strategy
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    url.pathname.match(/\.(js|css)$/i)
  ) {
    event.respondWith(handleAssetRequest(request));
    return;
  }

  // Let everything else go through normally
});

// Cache-first strategy for images (instant loading)
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE);
  
  // Try cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    console.log('[SW] Serving image from cache:', request.url.split('/').pop());
    return cachedResponse;
  }

  // If not in cache, fetch and cache it
  try {
    console.log('[SW] Fetching image:', request.url.split('/').pop());
    const response = await fetch(request);
    
    // Only cache successful responses
    if (response.ok) {
      // Clone the response before caching
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('[SW] Image fetch failed:', error);
    
    // If network fails, try to return cached version anyway
    return cachedResponse || new Response('Image unavailable', { 
      status: 503,
      statusText: 'Service Unavailable' 
    });
  }
}

// Network-first strategy for assets (always fresh, fallback to cache)
async function handleAssetRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    // Try network first
    const response = await fetch(request);
    
    // Cache the fresh version
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('[SW] Serving asset from cache:', request.url.split('/').pop());
      return cachedResponse;
    }
    
    throw error;
  }
}

// Optional: Listen for messages from the app
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data === 'CLEAR_CACHE') {
    event.waitUntil(
      Promise.all([
        caches.delete(CACHE_NAME),
        caches.delete(IMAGE_CACHE)
      ]).then(() => {
        console.log('[SW] Cache cleared');
      })
    );
  }
});

