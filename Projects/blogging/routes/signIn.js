import express from "express";
import User from "../models/user.js";

const signIn = express.Router();

signIn.get('/signin', (req, res) => {
    return res.render("signIn")
})

signIn.post("/signin", async (req, res) => {
    const {email, password} = req.body;
    const user = await User.matchPassword(email, password);
    
    console.log("User ", user)

    return res.redirect("/")
});

export default signIn;