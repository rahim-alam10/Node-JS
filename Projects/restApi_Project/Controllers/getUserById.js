import User from "../models/user.js"

async function getUserById(req, res) {
    const user = await User.findById(req.params.id)
    if(!user) return res.status(404).json({error: "User not found !!!"})
    return res.json(user)
}

export default getUserById;