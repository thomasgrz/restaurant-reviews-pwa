var staticCacheName = 'reviews-static-v8';

self.addEventListener('install', (event)=>{
    event.waitUntil(
        caches.open(staticCacheName).then((cache)=>{
            return cache.addAll([
                '/',
                'index.html',
                'restaurant.html',
                'css/styles.css',
                'js/main.js',
                'js/restaurant_info.js',
            ]);
        })
    );
});

self.addEventListener('activate', (event)=>{
    event.waitUntil(
        caches.keys().then((namesOfCaches)=>{
            return Promise.all(
                namesOfCaches.filter((name)=>{
                    return name.startsWith('reviews-') &&name!=staticCacheName;
                }).map((nameThatDoesntMatch)=>{
                    return caches.delete(nameThatDoesntMatch)
                })
            )
        })
    )
})
/*adapted from https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker */

self.addEventListener('fetch',(event)=>{
    event.respondWith(
        caches.open(staticCacheName).then((cache)=>{
            return cache.match(event.request).then((response)=>{
                return response || fetch(event.request).then((response)=>{
                    cache.put(event.request, response.clone())
                    return response;
                })
            })
        })
    )
})


