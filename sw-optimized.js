// Optimized Service Worker with proper caching strategies
const CACHE_NAME = 'portfolio-v2';
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/styles.css',
    '/script-optimized.js',
    '/lazy-loading.js',
    '/manifest.json',
    '/favicon.svg',
    '/images/profile-professional.jpg',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css'
];

// Install event - cache static files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                return cache.addAll(STATIC_FILES);
            })
            .catch(error => {
                console.error('Failed to cache static files:', error);
            })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .catch(error => {
                console.error('Failed to clean up caches:', error);
            })
    );
    self.clients.claim();
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip external requests (except fonts and CDN)
    if (url.origin !== location.origin && 
        !url.hostname.includes('fonts.googleapis.com') && 
        !url.hostname.includes('cdnjs.cloudflare.com')) {
        return;
    }

    event.respondWith(
        caches.match(request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    // Serve from cache and update in background
                    updateCache(request);
                    return cachedResponse;
                }

                // Not in cache, fetch from network
                return fetch(request)
                    .then(networkResponse => {
                        // Cache successful responses
                        if (networkResponse.status === 200) {
                            const responseClone = networkResponse.clone();
                            caches.open(DYNAMIC_CACHE)
                                .then(cache => {
                                    cache.put(request, responseClone);
                                })
                                .catch(error => {
                                    console.error('Failed to cache dynamic resource:', error);
                                });
                        }
                        return networkResponse;
                    })
                    .catch(error => {
                        console.error('Network request failed:', error);
                        // Return offline fallback if available
                        return caches.match('/index.html');
                    });
            })
    );
});

// Background cache update function
function updateCache(request) {
    fetch(request)
        .then(response => {
            if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(DYNAMIC_CACHE)
                    .then(cache => {
                        cache.put(request, responseClone);
                    })
                    .catch(error => {
                        console.error('Failed to update cache:', error);
                    });
            }
        })
        .catch(error => {
            console.error('Background update failed:', error);
        });
}

// Message handling for cache updates
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});