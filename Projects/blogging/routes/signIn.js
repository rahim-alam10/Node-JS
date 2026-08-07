import express from "express";
import User from "../models/user.js";

const signIn = express.Router();

signIn.get('/signin', (req, res) => {
    return res.render("signIn")
})

signIn.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);

        console.log("Token ", token)

        return res.cookie('token', token).redirect("/")

    } catch (error) {
        return res.render("signin", {
            error: "Incorrect Email or Password",
        })
        
    }
});

export default signIn;