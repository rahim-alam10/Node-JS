import { Router } from "express";
import { changeCurrentPassword, 
         getCurrentUser, 
         getUserChannelProfile, 
         getWatchHistory, 
         loginUser, 
         logoutUser, 
         refreshAccessToken, 
         registerUser, 
         updateAccountDetails, 
         updateUserAvatar, 
         updateUserCoverImage } 
from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();

router.post("/register",
    upload.fields([         // middle ware to check for the avatar and coverImage present or not
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser);

router.post("/login", loginUser)


// Secure routes
router.post("/logout", verifyJWT, logoutUser)
router.post("/refresh-token", refreshAccessToken)
router.post("/change-passwrod", verifyJWT, changeCurrentPassword)
router.get("/current-user", verifyJWT, getCurrentUser)
router.patch("/update-account", verifyJWT, updateAccountDetails)
router.patch("/avatar", verifyJWT, upload.single("avatar"), updateUserAvatar)
router.patch("/cover-image", upload.single("cover-image"), verifyJWT, updateUserCoverImage)
router.get("/c/:username", verifyJWT, getUserChannelProfile)
router.get("/history", verifyJWT, getWatchHistory)

export {
    router
}