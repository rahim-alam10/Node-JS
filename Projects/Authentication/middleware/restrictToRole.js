import getUser from "../service/getUser.js";

function restrictToRole(roles = []) {
  return function (req, res, next) {
    if (!req.user) {
      return res.redirect("/login");
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).send("Unauthorized");
    }

    next();
  };
}

export default restrictToRole;