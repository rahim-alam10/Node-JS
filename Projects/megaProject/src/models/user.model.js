import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt"             // help to creates hashed password

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        avatar: {
            type: String,       // Cloudinary url
            required: true,
        },
        coverImage: {
            type: String,       // Cloudinary url
            default: "",
        },
        watchHistory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Video",
            },
        ],
        password: {
            type: String,
            required: [true, 'Password is Required'],

        },
        refreshToken: {
            type: String,
            default: "",
        },
    }, { timestamps: true }
);

userSchema.pre("save", async function (next) {              //Pre always runs just before storing in database
    if (!this.isModified("password")) return next();        // Only Encrypt password first time

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return (await bcrypt.compare(password, this.password))
}

userSchema.methods.generateAccessToken = function (params) {
    const token = jwt.sign(
        {
            _id: this._id,
            email= this.email,
            userename= this.userename,
            fullName= this.fullName
        },
        process.env.ACCES_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCES_TOKEN_EXPIRY
        }
    )

    return token
}

userSchema.methods.generateRefreshToken = function (params) {
    const token = jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )

    return token
}

export default mongoose.model("User", userSchema);