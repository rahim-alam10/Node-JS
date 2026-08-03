import express from "express"
import signUp from "../controllers/signUp.js";
import logIn from "../controllers/logIn.js";

const userRouter = express.Router();

userRouter.post('/', signUp)
userRouter.post('/login', logIn)

export default userRouter;