import {asyncHandler} from "../utils/asynHandler.js"
import {ApiError} from "../utils/apiError.js"
import {User} from "../models/user.model.js"
import {uploadOncloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/apiResponse.js"


const registerUser = asyncHandler(async (req, res) => {
    
    // get user details from frontend
    const {fullName, username, email, password} = req.body
    console.log("email: ", email)


    // validation - not empty
    if(
        [fullName, username, email, password].some((filed) => {
            field?.trim() === ""
        })
    ){
        throw new ApiError(400, "All filds are required")
    }


    // check if user already exits: username, email
    const exitedUser = User.findOne({
        $or : [{username}, {email}] 
    })

    if(exitedUser){
        throw new ApiError(409, "User with email and password already exist")
    }


    // check for images, avatar
    const avatarLocalPath = req.files?.avatar[0]?.path  //avatar[0] = path object
    const coverImageLocalPath = req.files?.coverImage[0]?.path
    // avatar is mandatory so, check whether it is present or not
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar File is Required")
    }


    // upload them to cloudinary, avatar
    const avatar = await uploadOncloudinary(avatarLocalPath)
    const coverImage = await uploadOncloudinary(coverImageLocalPath)
    if(!avatar){
        throw new ApiError(400, "Avatar File is Required")
    }


    // create object - create entry in db
    user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })


    // remove password and refresh token field from response 
    const createdUser = await user.findById(user._id).select(
        "-password -refreshToken"
    )


    // check fro user creation
    if(!createdUser){
        throw ApiError(500, "Something went wrong while registering the user")
    }


    // return response
    return res.staus(201).json(
        new ApiResponse(200, "createdUser")
    )

});

export {
    registerUser,
};