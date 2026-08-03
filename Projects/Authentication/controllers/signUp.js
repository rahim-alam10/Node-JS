import User from "../models/user.js";
import URL from "../models/url.js";
import setUser from "../service/setUSer.js";

async function signUp(req, res) {
    const { name, email, password } = req.body;
    try {
        const user = await User.create({
            name,
            email,
            password
        })

        const token = setUser(user);
        res.cookie("uid", token);

        const allurls = await URL.find({});
        return res.render("home", {
            urls: allurls
        });
    } catch (error) {
        const message = error.code === 11000
            ? "Email already exists"
            : "Unable to create account";

        return res.status(400).render("signUp", {
            error: message
        });
    }
}

export default signUp;
