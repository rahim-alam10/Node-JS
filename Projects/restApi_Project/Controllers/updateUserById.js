import User from "../models/user.js"

async function updateUserById(req, res) {
    await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    return res.json({ Message: "Success" })
}

export default updateUserById;