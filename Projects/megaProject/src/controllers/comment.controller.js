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
    const comments = await Comment.aggregate([

    //    - $match: filter comments by videoId
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },

    //    - $lookup: join with User collection
        {
            $loookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },

    //    - $unwind: flatten owner array
        {
            $unwind: "$owner"
        },

    //    - $project: select only needed fields
        {
            $project: {
                _id: 1,
                content: 1,
                createdAt: 1,
                updatedAt: 1,
                "owner._id": 1,
                "owner.username": 1,
                "owner.fullName": 1,
                "owner.avatar": 1
            }
        },
        
    //    - $sort: sort by createdAt descending
         {
            $sort: {
                createdAt: -1
            }
        },

    //    - $skip: apply pagination
        {
            $skip: skip
        },

    //    - $limit: apply pagination
        {
            $limit: limitNumber
        }
    ])

    // 7. Get total comments count
    const totalComments = await Comment.countDocuments({ video: videoId })

    // 8. Calculate pagination metadata
    const totalPages = Math.ceil(totalComments / limitNumber)

    // 9. Return response with comments and pagination
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                comments,
                pagination: {
                    currentPage: pageNumber,
                    totalPages,
                    totalComments,
                    limit: limitNumber,
                    hasNextPage: pageNumber < totalPages,
                    hasPrevPage: pageNumber > 1
                }
            },
            "Comments fetched successfully"
        )
    )
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