import express from "express"
import User from "../models/user.js"

const signUp = express.Router();

signUp.get('/signup', (req, res) => {
    return res.render("signUp")
})

signUp.post("/signup", async (req, res) => {
    const { fullName, email, password } = req.body;

    await User.create({
        fullName,
        email,
        password,
    });

    return res.redirect("signIn");
});

export default signUp;