import getUser from "../service/getUser.js";

function checkForAuthentication(req, res, next) {
    const tokenCookie = req.cookies?.token;

    req.user = null;

    if (!tokenCookie) {
        return next();
    }

    const user = getUser(tokenCookie);

    req.user = user;

    return next();
}

export default checkForAuthentication;