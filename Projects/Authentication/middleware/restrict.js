import { start } from "repl";
import getUser from "../service/getUser.js";

async function restrictToLoggedInUserOnly(req, res, next) {
    const userUid = req.cookies?.uid;

    if (!userUid) {
        return res.redirect("/login");
    }

    const user = getUser(userUid);

    if (!user) {
        return res.redirect("/login");
    }

    req.user = user;
    next();
}

export default restrictToLoggedInUserOnly;