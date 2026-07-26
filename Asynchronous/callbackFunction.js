import http from 'http';

export function current(location, resultCallback){
    const options ={
        host: "api.weatherapi.com",
        path: `/v1/current.json?key=YOUR_API_KEY&q=${location}`,
    }

    http.request(options, function(response){
        let body = "";
        response.on("data", function(chunk){
            body+=chunk
        });
        response.on("end", function (){
            resultCallback(null, body)
        })
    })
    .on("error", function(err){
        resultCallback(err)
    })
    .end()
}