import mongoose from "mongoose";
import { timeStamp } from "node:console";
import { type } from "node:os";
const userSchema = new mongoose.Schema(
    {
        username: {
            type: string,
            required: true,
            unique: true
        },
        email: {
            type: email,
            required : true,
            unique : true, 
        },
        password : {
            type: string,
            required: true
        }
    }, {timestamps: true}
)

export const User = mongoose.model('User', userSchema)