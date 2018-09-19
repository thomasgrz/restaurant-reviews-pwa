const idb = require("idb");
var staticCacheName = 'reviews-static-v8';
self.addEventListener('install', (event)=>{
    event.waitUntil(
        /**
         * Set up cache, populate cache, set up idb, and populate idb.
         */
        Promise.all(
            [
                caches.open(staticCacheName).then((cache)=>{
                return cache.addAll([
                    '/',
                    'index.html',
                    'restaurant.html',
                    'css/styles.css',
                    'js/main.js',
                    'js/restaurant_info.js',
                ]);
                }), 
                dbPromise.then((db)=>{
                    return getRestaurants()
                        .then((restaurants)=>{
                            const tx = db.transaction("restaurants","readwrite")
                            const store = tx.objectStore("restaurants")
                            restaurants.map((restaurant)=>store.put(restaurant))
                        })
                })
            ]
        )
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


self.addEventListener('fetch',(event)=>{
    // if(new URL(event.request.url).pathname === "/restaurants/"){
    //     dbPromise.then((db)=>{
    //         const tx = db.transaction("restaurants","readonly");
    //         const store = tx.objectStore("restaurants")
    //         return store.getAll()
    //     }).then((allRestaurants)=>{
    //         const response = new Response(allRestaurants,{"content-type":"application/json"})
    //         console.log(response.clone())
    //         return response
    //     })
    // }else 
    if(new URL(event.request.url).pathname !== "/restaurants/"){
        console.log(new URL(event.request.url).pathname)
        /*adapted from https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker */
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
    }
})

function getRestaurants(){
    return fetch("http://localhost:1337/restaurants")
        .then((response)=>response.json())
        .catch((error)=>console.error("error: ", error))
}

const dbPromise = idb.open("restaurants-db",1,(upgradeDb)=>{
    upgradeDb.createObjectStore("restaurants",{keyPath:"id"})
})