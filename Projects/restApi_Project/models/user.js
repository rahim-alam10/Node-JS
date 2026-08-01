import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name :{
        type: String,
        required: true
    },
    last_name : {
        type: String
    },
    age : {
        type: Number,
        required: true
    },
    gender : {
        type: String,
        required: true
    }

}, {timestamps: true}) 

const User = mongoose.model("user", userSchema)

export default User; 