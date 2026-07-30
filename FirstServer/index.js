// My first Server
const express = require('express')
const http = require("http")
const fs = require("fs")

const app =  express()
const port = 3000

const myServer = http.createServer((req, res) => {
  const log = `${Date.now()}: New Reuest Recived`;
  fs.appendFile("log.txt", log, (err, res) => {
    res.end("Hello from server")
  });

})
// Define a basic route
app.get('/', (req, res) => {
  res.send('Express server is successfully running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});



