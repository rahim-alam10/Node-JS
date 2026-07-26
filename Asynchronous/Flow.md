Program Start
      │
      ▼
import http
      │
      ▼
current("Lahore", callback)
      │
      ▼
options object banta hai
      │
      ▼
http.request() request banata hai
      │
      ▼
.end() request send karta hai
      │
      ▼
Weather API request receive karti hai
      │
      ▼
Response chunks me aata hai
      │
      ▼
"data" event
      │
      ▼
body += chunk
      │
      ▼
Sare chunks receive ho gaye
      │
      ▼
"end" event
      │
      ▼
resultCallback(null, body)
      │
      ▼
User ko weather data mil jata hai