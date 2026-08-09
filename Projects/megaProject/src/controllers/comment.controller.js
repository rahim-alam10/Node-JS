import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    // 1. Get videoId from req.params
    const {videoId} = req.params

    // 2. Get page and limit from req.query (default: page=1, limit=10)
    const { page = 1, limit = 10 } = req.query

    // 3. Validate videoId
    if(!videoId){
        throw new ApiError(400, "Video Id Required")
    }

    // 4. Check if video exists
    const isVideoExist = await Video.findById(videoId)
    if(!isVideoExist){
        throw new ApiError(500, "Error: Video not found")
    }

    // 5. Calculate skip value: (page - 1) * limit
    const pageNumber = parseInt(page)
    const limitNumber = parseInt(limit)

    // Validate pagination values
    if (pageNumber < 1) {
        throw new ApiError(400, "Page must be greater than 0")
    }
    if (limitNumber < 1 || limitNumber > 100) {
        throw new ApiError(400, "Limit must be between 1 and 100")
    }
        
    // Calculate skip value
    const skip = (pageNumber - 1) * limitNumber
    // 6. Use aggregation pipeline:
    //    - $match: filter comments by videoId
    //    - $lookup: join with User collection
    //    - $unwind: flatten owner array
    //    - $project: select only needed fields
    //    - $sort: sort by createdAt descending
    //    - $skip: apply pagination
    //    - $limit: apply pagination
    // 7. Get total comments count
    // 8. Calculate pagination metadata
    // 9. Return response with comments and pagination
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }