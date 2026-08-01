import express from "express";
import userRouter from "./routes/userRouter.js";
import connectDb from "./db/connectDb.js";
import logReqRes from "./middleWares/logReqRes.js";

const app = express();
const PORT = 8000;

//Connection
connectDb("mongodb://127.0.0.1:27017/backend").then(()=> console.log("MongoDb Connected Successfully...."))


// Middleware - Plugin    
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(logReqRes("log.txt"));
    
//Routes
app.use("/api/user", userRouter)


app.listen(PORT, () => {
    console.log(`Server is listening at Port ${PORT}`);
});