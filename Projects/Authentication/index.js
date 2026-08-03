import express from "express";
import connectDb from "./db/connectDb.js";
import URL from "./models/url.js";
import path from "path";
import urlRouter from "./routes/urlRouter.js"
import staticRouter from "./routes/staticRouter.js"
import userRouter from "./routes/userRouter.js"
import cookieParser from "cookie-parser";
import restrictToLoggedInUserOnly from "./middleware/restrict.js";
import { fileURLToPath } from "url";
import checkForAuthentication from "./middleware/checkForAuthenticaion.js";
import restrictToRole from "./middleware/restrictToRole.js"

const app = express();
const PORT = 8000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Connection
connectDb("mongodb://127.0.0.1:27017/backend")
    .then(()=> console.log("MongoDb Connected Successfully...."))

app.set("view engine", "ejs")
app.set("views", path.resolve(__dirname, "views"))

//Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(checkForAuthentication)

//Routers
app.use("/url",restrictToRole("[NORMAL], [ADMIN]"), urlRouter)
app.use("/user", userRouter)
app.use("/", staticRouter)

app.get("/url/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
            shortId,
        },
        {
            $push:{
            visitHistory: {
                timestamp: Date.now()
            }
            }
        }
    )

    res.redirect(entry.redirectURL)
})

app.listen(PORT, () => {
    console.log(`Server is listening at Port ${PORT}`);
});
