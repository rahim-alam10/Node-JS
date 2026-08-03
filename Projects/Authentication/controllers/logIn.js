import User from "../models/user.js";
import setUser from "../service/setUSer.js";

async function logIn(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
        return res.render("logIn", {
            error: "Invalid Username or Password",
        });
    }

    const token = setUser(user);
    res.cookie("token", token);
    return res.redirect("/");
}

export default logIn;
