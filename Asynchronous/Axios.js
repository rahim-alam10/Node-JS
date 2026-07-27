const axios = require('Axios')

        //  Making a GET Request
axios.get('https://api.example.com/data')
    .then(response => {
        console.log(response.data)
    })

    .catch(error => {
        console.error('Error fetching data:', error);
    })

        // Making a Post Request

// Data to be sent in the POST request.
const data = {
 name: 'John Doe',
 age: 30
};

// Using the axios.post method to make a POST request
axios.post('https://api.example.com/users', data)
 .then(response => {
  console.log('User created:', response.data);
 })
 .catch(error => {
  console.error('Error creating user:', error);
 });        



        // Using Async/Await with Axios

// Asynchronous function to post data to an API
async function postData() {
 try {
  // Await the response from the Axios POST request
  let response = await axios.post('https://jsonplaceholder.typicode.com/posts', {
   title: 'foo',
   body: 'bar',
   userId: 1
  });

  // Log the response data to the console
  console.log(response.data);
 } catch (error) {
  // If there is an error, log the error message
  console.error('Error posting data:', error);
 }
}

// Call the async function
postData();