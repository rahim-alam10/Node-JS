import jwt from "jsonwebtoken";

function setUser(user){
    const secret = "rahim@10$"
    const payload = {
        _id : user._id,
        email: user.email
    }
    return jwt.sign(payload, secret)
}

export default setUser;
 