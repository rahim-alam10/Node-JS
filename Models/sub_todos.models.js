import mongoose from "mongoose";
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
            
        }
    }
)