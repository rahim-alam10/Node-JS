import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { type } from "node:os";

const commentSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },

        video: {
            type: Schema.Types.objectId,
            ref: "Video"
        },

        ownwe: {
            type: Schema.Types.objectId,
            ref: "User"
        }
        
    },{timestamps: true}
)

commentSchema.plugin(mongooseAggregatePaginate)

export const Comment = mongoose.model("Comment", commentSchema)