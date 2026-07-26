let myPromis = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Promise resolved");
    }, 6000)
})

console.log("Before Calling Promise");

myPromis.then((successMessage) => {
    console.log("From CallBack " + successMessage)
})

console.log("After Calling Promise")