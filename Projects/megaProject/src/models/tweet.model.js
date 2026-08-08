import mongoose, { model, Schema } from "mongoose";

const tweetSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },

        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
        
    }, {timpestamps: true}
)

export const Tweet = mongoose.model("Tweet", tweetSchema)