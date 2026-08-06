import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOncloudinary = async (localFilepath) => {
    try {
        if (!localFilepath) return null;

        console.log("Uploading file:", localFilepath);

        const response = await cloudinary.uploader.upload(localFilepath, {
            resource_type: "auto",
        });

        console.log("✅ File uploaded successfully\n");

        // Delete local file after successful upload
        await fs.unlink(localFilepath);

        return response;
    } catch (error) {
        console.error("❌ Cloudinary Upload Error:");
        console.error(error);

        // Delete local file if it exists
        try {
            if (localFilepath) {
                await fs.unlink(localFilepath);
            }
        } catch (err) {
            console.error("Error deleting local file:", err.message);
        }

        return null;
    }
};

export { uploadOncloudinary };