class ApiError extends Error{
    constructor(
        statusCode,
        message = "Something went Wrong",
        error = [],
        stack = ""
    ){
        
    }
}