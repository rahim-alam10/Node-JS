import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import {User}from "../models/user.model.js"


export const verifyJWT = asyncHandler( async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if(!token){
            throw new ApiError(401, "Unauthorized Request")
        }

        /*
            jwt.verify does 3 things:
            1. Checks if token was signed with our secret key
                (like checking if the hologram is real)
            2. Checks if token has expired
                (like checking if the ID card is expired)
            3. Checks if token has been tampered with
                (like checking if someone scratched off your name)
        */   

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        // Finding the User in Database
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if(!user){
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
        
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
    }

})