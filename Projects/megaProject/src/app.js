import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

// CORS isliye use karte hain taake React frontend aur Express backend aapas mein safely communicate kar saken.
// Browser by default different origins (different port/domain/protocol) ki requests ko block karta hai.
//  cors middleware backend se browser ko permission deta hai ke React app requests bhej sakti hai.
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// Setting Middlewares
app.use(express.json({limit: "16kb"}))      // json data limit 
app.use(express.urlencoded({extended: true, limit: "16kb"}))        //url encoder
app.use(express.static("public"))           // Public Assets: Access by anyone
app.use(cookieParser())                     // To perfome CRUD operations on cookies

// routers import
import { router as userRouter } from "./routes/user.routes.js";


// routes declaration
app.use("/user", userRouter);

export default app;