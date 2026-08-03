import { Router } from "express";
import generateNewShortURL from "../controllers/generateNewShortURL.js"
import getAnalytics from "../controllers/getAnalytics.js";

const urlRouter = Router();

urlRouter.post("/", generateNewShortURL);

urlRouter.get("/analytics/:shortId", getAnalytics);

export default urlRouter;
