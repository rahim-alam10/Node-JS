import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";     // Aggregation queries mein pagination ki functionality add karne ke liye plugin
const videoSchema = new mongoose.Schema(
    {
        videoFile: {
            type: String,     // Cloudinary url
            required: true,
        },

        thumbnail: {
            type: String,     // Cloudinary url
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        duration: {
            type: Number,       // Cloudinary url
            default: 0,
        },

        views: {
            type: Number,
            default: 0,
        },

        isPublished: {
            type: Boolean,
            default: true,
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    }, { timestamps: true }
);

videoSchema.plugin(mongooseAggregatePaginate)

const Video = mongoose.model("Video", videoSchema);

export default Video;