import express from "express";
import path from "path";
import signUp from "./routes/signUp.js";
import signIn from "./routes/signIn.js";
import mongoose from "mongoose";
import connectDb from "./db/connectDb.js";

const app = express()
const PORT = 8000;

//Database Connection
connectDb("mongodb://127.0.0.1:27017/blogging")

app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))

//middleWare
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
    res.render("home")
})

app.use('/user', signUp)
app.use('/user', signIn)

app.listen(PORT, () => console.log(`Server is Listening at port:${PORT}`))
