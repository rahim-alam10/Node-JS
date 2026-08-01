import { Router } from "express";
import getUserById from "../Controllers/getUserById.js";
import getAllUsers from "../Controllers/getAllUsers.js";
import updateUserById from "../Controllers/updateUserById.js";
import deleteUserById from "../Controllers/deleteUserById.js";
import createNewUser from "../Controllers/createNewUSer.js";

const router = Router();

router.route("/")
    .get(getAllUsers)
    .post(createNewUser);

router.route("/:id")
    .get(getUserById)
    .patch(updateUserById)
    .delete(deleteUserById);

export default router;