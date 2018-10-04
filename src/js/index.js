var idb = require("idb")
var staticCacheName = 'reviews-static-v11';
self.addEventListener('install', function (event) {
  event.waitUntil(
  /**
   * Set up cache, populate cache, set up idb, and populate idb.
   */
  Promise.all([caches.open(staticCacheName).then(function (cache) {
    //add (relatively) static assets to cache
    return cache.addAll([
      '/', 
      'index.html', 
      'js/dbhelper.js',
      'restaurant.html', 
      'css/styles.css', 
      'js/main.js', 
      'js/restaurant_info.js'
    ]);
  }), //add restaurants to idb
  dbPromise.then(function (db) {
    return getRestaurants().then(function (restaurants) {
      var tx = db.transaction("restaurants", "readwrite");
      var store = tx.objectStore("restaurants");
      restaurants.map(function (restaurant) {
        return store.put(restaurant);
      });
    });
  }), //add  reviews to idb
  dbPromise.then(function (db) {
    return getReviews().then(function (reviews) {
      var tx = db.transaction("restaurant-reviews", "readwrite");
      var store = tx.objectStore("restaurant-reviews");
      reviews.map(function (review) {
        return store.put(review);
      });
    });
  })]));
});


self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (namesOfCaches) {
    return Promise.all(namesOfCaches.filter(function (name) {
      return name.startsWith('reviews-') && name != staticCacheName;
    }).map(function (nameThatDoesntMatch) {
      return caches.delete(nameThatDoesntMatch);
    }));
  }));
});
self.addEventListener('fetch', function (event) {
  //parse the url the of the request
  var url = new URL(event.request.url); //extract the pathname from the request the url

  var requestURLPath = new URL(event.request.url).pathname; //extract the port from the request url

  var serverPort = new URL(event.request.url).port; //if its a request for restaurant data....
  if (requestURLPath.includes("/restaurants") && serverPort == "1337") {
    return event.respondWith(dbPromise.then(function (db) {
      //open database and extract all the restaurant data
      return db.transaction("restaurants", "readwrite").objectStore("restaurants").getAll();
    }) //reply from restaurant database if offline/slow connection
    .then(function (jsonArray) {
      return new Response(JSON.stringify(jsonArray), {
        "headers": {
          "content-type": "text/html; charset=utf-8"
        }
      });
    }));
  } //if its a request for sprestaurant reviews....
  else if (requestURLPath.includes("/reviews") && serverPort == "1337") {
      if (url.search.includes("?restaurant_id")) {
        //extract the restaurant_id number 
        var id = url.search.match(/\d+$/); 
         //respond to request with:
        return event.respondWith( //open idb on restaurants-db
        dbPromise.then(function (db) {
          //open a transaction, then open a cursor on the index 
          var tx = db.transaction("restaurant-reviews", "readonly");
          var store = tx.objectStore("restaurant-reviews"); //iterate over everything within the index
          
          return store.getAll();
        }).then(function (reviews) {
          var arr = reviews.filter(function (review) {
            return review.restaurant_id == id;
          });
          return new Response(JSON.stringify(arr), {
            "headers": {
              "content-type": "text/html; charset=utf-8"
            }
          });
        }));
      }
    } //if requesting static files / data...
    else {
        console.log(new URL(event.request.url));
        /*adapted from https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker */
        
        let options = {}
        if(url.pathname.includes("restaurant.html")){
          options.ignoreSearch = true;
        }
        //reply from cached assets if avaialble or cache the resouce and reply
        //from the network
        return event.respondWith( 
        caches.open(staticCacheName).then(function (cache) {
          return cache.match(event.request,options).then(function (response) {
            return response || fetch(event.request).then(function (response) {
              cache.put(event.request, response.clone());
              return response;
            });
          });
        }).catch(function (error) {
          return console.error("there's been a problem in the caching within service worker: ", error);
        }));
      }
});

function getRestaurants() {
  return fetch("http://localhost:1337/restaurants").then(function (response) {
    return response.json();
  }).catch(function (error) {
    return console.error("error: ", error);
  });
}

function getReviews() {
  return fetch("http://localhost:1337/reviews").then(function (response) {
    return response.json();
  }).catch(function (error) {
    return console.error("problem from getReviews(): ", error);
  });
}

var dbPromise = idb.open("restaurants-db", 1, function (upgradeDb) {
  switch (upgradeDb.oldVersion) {
    case 0:
      upgradeDb.createObjectStore("restaurants", {
        keyPath: "id"
      });
      upgradeDb.createObjectStore("restaurant-reviews", {
        keyPath: "id"
      }).createIndex("restaurant_id", "restaurant_id");
  }
});