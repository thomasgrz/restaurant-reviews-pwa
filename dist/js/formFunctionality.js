window.addEventListener("DOMContentLoaded",function(event){
    (()=>{
        let i = Object.keys(localStorage).length -1
        let [...items] = Object.keys(localStorage)
        while(navigator.onLine && i>=0){
            console.log(JSON.parse(localStorage.getItem(items[i])))
            i--;
        }
        localStorage.clear()
    })()
})

window.addEventListener("offline",function(event){
    console.log("you are offline..")
    putIntoStorage
})

if(navigator.online){
    localStore.set("review","test review")
}

function putIntoStorage(form){
    index = Object.keys(localStorage).length + 1
    let formToStore = {name: form.name.value, rating:form.rating.value,review:form.review.value}
    localStorage.setItem(index,JSON.stringify(formToStore))
}