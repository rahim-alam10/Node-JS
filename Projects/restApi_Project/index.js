import express from "express";
import userRouter from "./routes/userRouter.js";
import connectDb from "./db/connectDb.js";
import logReqRes from "./middleWares/logReqRes.js";
import path from "path";
import User from "./models/user.js";

const app = express();
const PORT = 8000;

//Connection
connectDb("mongodb://127.0.0.1:27017/backend").then(()=> console.log("MongoDb Connected Successfully...."))

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"))

app.use(express.json())

app.get("/test", async (req, res) => {
    const allUsers = await User.find({});
    return res.render('home', { users: allUsers })
})

// Middleware - Plugin    
app.use(express.urlencoded({extended: false}))
app.use(logReqRes("log.txt"));
    
//Routes
app.use("/api/user", userRouter)


app.listen(PORT, () => {
    console.log(`Server is listening at Port ${PORT}`);
});