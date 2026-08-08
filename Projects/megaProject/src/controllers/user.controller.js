import { asyncHandler } from "../utils/asynHandler.js"
import { ApiError } from "../utils/apiError.js"
import User from "../models/user.model.js"
import Video from "../models/video.model.js"
import { uploadOncloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js"
import jwt from "jsonwebtoken"


const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const refreshToken = user.generateRefreshToken()
        const accessToken = user.generateAccessToken()

        // Save the refresh token to database
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { refreshToken, accessToken }

    } catch (error) {
        console.log(error);      // or console.error(error)
        throw new ApiError(
            500,
            "Something went wrong while generating Refresh and Access Token"
        );
    }
}


const registerUser = asyncHandler(async (req, res) => {

    // get user details from frontend
    const { fullName, username, email, password } = req.body
    console.log("email: ", email)


    // validation - not empty
    if (
        [fullName, username, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }


    // check if user already exits: username, email
    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existingUser) {
        throw new ApiError(409, "User with email or username already exists");
    }


    // check for images, avatar
    const avatarLocalPath = req.files?.avatar[0]?.path  //avatar[0] = path object
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    // avatar is mandatory so, check whether it is present or not
    if (!avatarLocalPath) {
        throw new ApiError(500, "Cloudinary upload failed");
    }


    // upload them to cloudinary, avatar
    const avatar = await uploadOncloudinary(avatarLocalPath)
    const coverImage = await uploadOncloudinary(coverImageLocalPath);
    if (!avatar) {
        throw new ApiError(400, "Avatar File is Required")
    }


    // create object - create entry in db
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })


    // remove password and refresh token field from response 
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )


    // check fro user creation
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }


    // return response
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    )

});


const loginUser = asyncHandler(async (req, res) => {
    // get data from req.body
    const { email, username, password } = req.body


    // check the username or email given or not
    if (!username && !email) {
        throw new ApiError(400, "Username or Password is Required ")
    }


    // find the user
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (!user) {
        throw new ApiError(400, "User doesnot Exist")
    }


    // password check 
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid User Credentials")
    }


    // access and refresh token
    const { refreshToken, accessToken } = await generateAccessAndRefreshToken(user._id)


    // pass info to user
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")


    // send cookies
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User Logged In Successfully"
            )
        )

})


const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User Logged Out "))

})


const refreshAccessToken = asyncHandler(async (req, res) => {
    //get the user's refreshToken through cookies or body
    const incomingRefreshToken = req.cookies.
        refreshToken || req.body.refreshToken

    // Check whether user's refreshToken is present
    if (incomingRefreshToken) {
        throw new ApiError(401, "UnAuthorized request")
    }

    // check whether refreshToken is valid
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_ACCESS_TOKEN
        )

        // Find the user with the refreshToken
        const user = await User.findById(decodedToken?._id)

        // if user not present 
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (!incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh Token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true
        }
        const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("accessToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken, },
                    "Access Token Refreshed"
                )

            )

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Refresh Token")
    }
})


const changeCurrentPassword = asyncHandler( async(req, res) => {
    const {oldPassword, newPassword} = req.body
    
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400, "Invalid Password")
    }

    user.password= newPassword
    await user.save({validateBeforeSave: false})

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password Changed Successfully"))
})


const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(200, req.user, "Current User Fetched Successfully")

})


const updateAccountDetails = asyncHandler(async (req, res) => {
    const {fullName, email} = req.body

    if(!fullName || !email){
        throw new ApiError(400, "All Fileds are Required")
    }

    const user = User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                fullName,
                email,
            }
        },
        {new: true}         // returns updated information
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account Details Updated Successfully"))        
})


const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar File is Missing")
    }

    const avatar = await uploadOncloudinary(avatarLocalPath)

    if(!avatar.url){
        throw new ApiError(400, "Error While Uploading Avatar")
    }

    const user = await User.findOneAndUpdate(
        req.user?._id,
        {
            $set : {
                avatr: avatar.url
            }
        },
        {
            new: true
        }
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Avatar Updated Successfully"))   
})


const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path
    if(!coverImageLocalPath){
        throw new ApiError(400, "Cover Image is Missing")
    }

    const coverImage = await uploadOncloudinary(coverImageLocalPath)

    if(!coverImage.url){
        throw new ApiError(400, "Error While Uploading Cover Image")
    }

    const user = await User.findOneAndUpdate(
        req.user?._id,
        {
            $set : {
                coverImage: coverImage.url
            }
        },
        {
            new: true
        }
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Cover Image Updated Successfully"))   
})


const getUserChannelProfile  = asyncHandler(async (req, res) => {
    const {username} = req.params       // paramas is used because username is coming from URL

    if(!username.trim()){
        throw new ApiError(400, "Username is Missing")
    }

    const channel = await User.aggregate([
        {
            // checks for username in User
            $match: {
                username: username?.toLowerCase()
            }
        },
            // Joining user and subscription, and extract the user's id with the same channel
        {
            $lookup: {
                from: "subscription",
                localField: _id,
                foreignField: "channel",
                as: "subscribers"
            }
        },
            // Joining user and subscription, and extract the user's id with the same subscriber
        {
            $lookup: {
                from: "subscription",
                localField: _id,
                foreignField: "subscriber",
                as: "subscribedTo"
            }   
        },
        {
            //$addFields existing document ke andar naye fields calculate karke add karta hai.
            $addFields: {
                subscribersCount: {
                    $size: "$subscriber"
                },
                channelsSubscribedToCount : {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},    // True when user is a subscriber
                        then: true,
                        else: false
                    }
                }
            }
        },
        // $project decide karta hai ke final result mein kaun se fields bhejne hain aur kaun se nahi.
        {
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1
            }
        }      
    ])

    if(!channel?.length){
        throw new ApiError(404, "Channel doesn't Exists")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, channel[0], "User channel fetched Successfully")
        )
})


const getWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            // Find the user
            $match : {
                _id: new mongoose.Types.objectId(req.user._id)
            }
        },

        {
            $lookup : {
                from: videos,
                localField: "watchhistory",
                foreignField: "_id",
                as : "watchhistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline:[
                                {
                                    $project: {
                                        fullname: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }, 
                        
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])
    return res
        .status(200)
        .json(
            new ApiResponse(200, user[0].watchHistory, "User Watch History fetched Successfully")
        )

})




export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
};