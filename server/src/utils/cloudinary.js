import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from 'dotenv'
// Ensure that environment variables are loaded before configuring Cloudinary
dotenv.config({
  path:"server/.env"
});

// Configure Cloudinary with your API key, API secret, and cloud name
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    // console.log("cloudinary localfilepath", localFilePath);
    // console.log("CLOUDINARY_API_KEY", process.env.CLOUDINARY_API_KEY);
    
    // Check if localFilePath is provided
    if (!localFilePath) {
      throw new Error("Local file path is missing.");
    }

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // File has been uploaded successfully
    console.log("File uploaded on Cloudinary", response.url);
    
    // Unlinking file from public/temp
    console.log('Processing files...');
    fs.unlinkSync(localFilePath);
    
    return response;
  } catch (error) {
    console.log("Error in uploading file to Cloudinary", error);
    
    // Remove the locally saved temporary file if upload operation fails
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    
    return null;
  }
};

export { uploadOnCloudinary };
