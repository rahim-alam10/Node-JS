import jwt from "jsonwebtoken";

function getUser(token){
    const secret = "rahim@10$"
    if(!token) return null;
    try {
        return jwt.verify(token, secret)
    } catch (error) {
        return null;
    }
}

export default getUser;
