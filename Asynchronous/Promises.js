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

// Import the 'fs' module and use its promise-based methods
const fs = require('fs').promises;

// Read the content of the file 'example.txt' with 'utf8' encoding
fs.readFile('example.txt', 'utf8')
 // Handle the resolved state of the promise
 .then((data) => {
  // This block will execute if the file is read successfully
  console.log(data); // Print the file content to the console
 })
 // Handle the rejected state of the promise
 .catch((err) => {
  // This block will execute if there is an error reading the file
  console.error('Error reading file:', err); // Print the error message to the console
 });