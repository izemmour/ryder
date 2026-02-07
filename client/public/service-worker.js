/**
 * Service Worker for FluffCo Pillow Landing Page
 * Implements offline caching for critical assets to improve repeat visit performance
 * 
 * Cache Strategy:
 * - Static assets (CSS, JS, images, fonts): Cache-first with network fallback
 * - HTML pages: Network-first with cache fallback
 * - API calls: Network-only (no caching for dynamic data)
 */

const CACHE_VERSION = 'fluffco-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

// Critical assets to cache immediately on install
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  // Core scripts and styles will be added by build process
];

// Assets to cache on first request
const CACHE_PATTERNS = {
  images: /\.(png|jpg|jpeg|webp|svg|gif|ico)$/i,
  fonts: /\.(woff|woff2|ttf|eot)$/i,
  styles: /\.css$/i,
  scripts: /\.js$/i,
};

/**
 * Install event - cache critical assets
 */
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[Service Worker] Caching critical assets');
        return cache.addAll(CRITICAL_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Installation complete');
        // Force the waiting service worker to become the active service worker
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] Installation failed:', error);
      })
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Delete caches that don't match current version
              return cacheName.startsWith('fluffco-') && 
                     cacheName !== STATIC_CACHE && 
                     cacheName !== DYNAMIC_CACHE;
            })
            .map((cacheName) => {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activation complete');
        // Take control of all pages immediately
        return self.clients.claim();
      })
  );
});

/**
 * Determine if a request should be cached
 */
function shouldCache(request) {
  const url = new URL(request.url);
  
  // Don't cache API calls
  if (url.pathname.startsWith('/api/')) {
    return false;
  }
  
  // Don't cache external resources
  if (url.origin !== self.location.origin) {
    return false;
  }
  
  return true;
}

/**
 * Determine cache strategy based on request type
 */
function getCacheStrategy(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // HTML pages: Network-first (always try to get fresh content)
  if (pathname === '/' || pathname.endsWith('.html')) {
    return 'network-first';
  }
  
  // Static assets: Cache-first (faster repeat visits)
  if (
    CACHE_PATTERNS.images.test(pathname) ||
    CACHE_PATTERNS.fonts.test(pathname) ||
    CACHE_PATTERNS.styles.test(pathname) ||
    CACHE_PATTERNS.scripts.test(pathname)
  ) {
    return 'cache-first';
  }
  
  // Default: Network-first
  return 'network-first';
}

/**
 * Cache-first strategy: Try cache, fallback to network
 */
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok && shouldCache(request)) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Fetch failed:', error);
    throw error;
  }
}

/**
 * Network-first strategy: Try network, fallback to cache
 */
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok && shouldCache(request)) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Network failed, trying cache:', request.url);
    
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If both network and cache fail, return error
    throw error;
  }
}

/**
 * Fetch event - intercept network requests
 */
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip API calls (let them go through normally)
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/api/')) {
    return;
  }
  
  const strategy = getCacheStrategy(event.request);
  
  if (strategy === 'cache-first') {
    event.respondWith(cacheFirst(event.request));
  } else {
    event.respondWith(networkFirst(event.request));
  }
});

/**
 * Message event - handle messages from clients
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});
