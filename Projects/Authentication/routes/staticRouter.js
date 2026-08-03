import { Router } from "express";
import URL from "../models/url.js";
import restrictToRole from "../middleware/restrictToRole.js";

const router = Router();

router.get("/admin/urls" , restrictToRole(["ADMIN"]), async (req, res) => {
    const allurls = await URL.find({})
    return res.render("home", {
    urls: allurls,
  })
});

router.get("/" , restrictToRole(["NORMAL", "ADMIN"]), async (req, res) => {
  const allurls = await URL.find({ createdBy: req.user._id });
  return res.render("home", {
    urls: allurls,
  });
});

router.get("/signup", (req, res) => {
  return res.render("signUp");
});

router.get("/login", (req, res) => {
  return res.render("logIn");
});
export default router;
