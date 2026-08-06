import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOncloudinary = async (localFilepath) => {
    try {
        if(!localFilepath) return null
        // upload on Cloudinary
        const response = await cloudinary.uploader.upload(localFilepath, {
            resourse_type : "auto"
        })
        // File uploaded Successfully
        console.log("File is Uploaded on Cloudinary Successfully...", response.url)

        return response

    } catch (error) {
        fs.unlink(localFilepath) // remove the loaclly saved temporary file as tthe operation got failed

        return null
    }
}

export {uploadOncloudinary}