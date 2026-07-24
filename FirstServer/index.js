// My first Server

const express = require('express')
 
const app =  express()
const port = 3000

// Define a basic route
app.get('/', (req, res) => {
  res.send('Express server is successfully running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});



