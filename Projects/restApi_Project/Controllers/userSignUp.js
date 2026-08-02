import User from "../models/user.js"

async function UserSignup(req, res) {
    const {userName, email, password} = req.body
    await User.create({
        userName,
        email,
        password
    })

    const users = await User.find({})
    return res.render("home", { users })
}

export default UserSignup;
