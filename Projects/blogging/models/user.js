import mongoose from "mongoose";
import {createHmac, randomBytes} from "crypto"
import { createTokenForUser, validateToken} from "../services/auth.js";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    profileImageUrl: {
        type: String,
        default: "/images/defaultPic.svg"
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }

}, {timestamps: true})

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = "somerandomsalt";

    const hashedPassword = createHmac("sha256", salt)
        .update(this.password)
        .digest("hex");

    this.salt = salt;
    this.password = hashedPassword;
});

userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
    const user = await this.findOne({ email });

    if (!user) {
        throw new Error("User not found");
    }

    const userProvidedHash = createHmac("sha256", user.salt)
        .update(password)
        .digest("hex");

    if (user.password !== userProvidedHash) {
        throw new Error("Incorrect Password");
    }

    const token = createTokenForUser(user);

    return token;
});

const User = mongoose.model('user', userSchema)

export default User;