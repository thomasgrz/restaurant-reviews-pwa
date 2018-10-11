/**
 * Common database helper functions.
 */
class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337 // Change this to your server port
    return `http://localhost:${port}/restaurants/`;
  }

  /**
   * Fetch all restaurants.
   */
  // static fetchRestaurants(callback) {
  //   let xhr = new XMLHttpRequest();
  //   xhr.open('GET', DBHelper.DATABASE_URL);
  //   debugger;
  //   xhr.onload = () => {
  //     if (xhr.status === 200) { // Got a success response from server!
  //       const json = JSON.parse(xhr.responseText);
  //       const restaurants = json;
  //       callback(null, restaurants);
  //     } else { // Oops!. Got an error from server.
  //       const error = (`Request failed. Returned status of ${xhr.status}`);
  //       callback(error, null);
  //     }
  //   };
  //   xhr.send();
  // }
  static fetchFromNetwork(callback){
    return fetch(DBHelper.DATABASE_URL) 
      .then((response)=>{
        if(response.status==200){
          return response.json()
        }
      })
      .then((json)=>{ 
        return callback(null, json)
      })
      .catch(()=>{
        idb.open("restaurants-db",1).then((db)=>{
          const tx = db.transaction("restaurants","readonly")
          const store = tx.objectStore("restaurants");
          return store.getAll();
        }).then((allRestaurants)=>{
          return callback(null, allRestaurants)
        })
      })
  }

  static fetchRestaurants(callback){
    return this.fetchFromNetwork(callback)
  }
  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`/images/${restaurant.id}`);
  }

  /**
   * Map marker for a restaurant.
   */
   static mapMarkerForRestaurant(restaurant, map) {
    // https://leafletjs.com/reference-1.3.0.html#marker  
    const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
      {title: restaurant.name,
      alt: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant)
      })
      marker.addTo(newMap);
    return marker;
  } 
  /* static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  } */

  //send reviews to server or store them offline 
  static sendReview(parametersObject){
    const key = Object.keys(localStorage).length + 1;
    if(navigator.onLine){
      fetch("http://localhost:1337/reviews/",{
        method: "POST",
        headers: {
          "content-type":"application/json; charset=utf-8"
        },
        body: JSON.stringify(parametersObject)
      })
    }else if(!navigator.onLine){
      localStorage.setItem(key, JSON.stringify({
        type: "review",
        review: parametersObject
      }))
    }
  }

  //if you're online again submit stored reviews
  static submitOfflineReviews(){
    const keysArray = Object.keys(localStorage)
    let counter = 0
    while(counter<keysArray.length && navigator.onLine){
      let content = JSON.parse(localStorage.getItem(keysArray[counter]))
      if(content.type==="review"){
        let review = content.review
        fetch("http://localhost:1337/reviews/",{
          method: "POST",
          headers: {
            "content-type":"texgt/html; charset=utf-8",
          },
          body: JSON.stringify(review)
       })
      }else if(content.type==="favorite"){
        console.log(content.id, content.status)
        fetch(`http://localhost:1337/restaurants/${JSON.parse(content.id)}/?is_favorite=${JSON.parse(content.status)}`,{
          method: "PUT"
       }).then(()=>{
        localStorage.removeItem(keysArray[counter])
       })
      }      
      counter++;
    }
  }

  static favoriteReviewLogic(element){
    element.addEventListener("click",()=>{
      let newObj;
      let id = new URL(element.parentElement.getElementsByTagName("a")[0].href).search.slice(4,)
      let status = !JSON.parse(element.getAttribute("isfavorite"))
      
      element.setAttribute("isfavorite",status)
      Promise.all([
        this.pushFavorite(id, status)
      ])
      .then(()=>{
       idb.open("restaurants-db")
        .then((db)=>{
          db.transaction("restaurants","readwrite").objectStore("restaurants").get(JSON.parse(id))
          .then((entry)=>{
            newObj = Object.assign(entry,{is_favorite: status})
            db.transaction("restaurants","readwrite").objectStore("restaurants").put(newObj)
          })
        })
      })
    })
  }

  static pushFavorite(id, status){
    if(navigator.onLine){
      fetch(`http://localhost:1337/restaurants/${id}/?is_favorite=${status}`,{
        method:"PUT"
      })
    }else{ 
      const key = Object.keys(localStorage).length + 1
      localStorage.setItem(key, JSON.stringify({
        type: "favorite",
        status: status,
        id: id
      }))
    }
  }
}



