import User from "../models/user.js"

async function getAllUsers(req, res) {
    const allDbUsers = await User.find({})
    return res.json(allDbUsers);
}

export default getAllUsers;