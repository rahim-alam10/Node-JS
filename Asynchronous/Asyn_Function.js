// Async function that wraps the operation
async function myAsyncFunction() {
 // Simulating a condition with a boolean variable 'success'
 let success = true;

 // If the condition is true, resolve with a success message
 if (success) {
  return "The operation was successful!";
 } else {
  // If the condition is false, throw an error to simulate rejection
  throw new Error("The operation failed!");
 }
}

// Using async function to handle Promise
async function executeAsyncFunction() {
 try {
  // Await the async function call to get the result
  const result = await myAsyncFunction();
  console.log(result); // Output the result if successful
 } catch (error) {
  console.error(error.message); // Handle and output any errors
 }
}

// Call the async function to execute
executeAsyncFunction();