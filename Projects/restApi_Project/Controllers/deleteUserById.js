import User from "../models/user.js"

async function deleteUserById(req, res) {
    await User.findByIdAndDelete(req.params.id);
    return res.json({ Status: "Success" })
}

export default deleteUserById