import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Seller } from "../models/seller.model.js";

const registerSeller = asyncHandler(async (req, res) => {
  //get seller details form frontend
  const { s_username, s_email, s_name, password, s_address, s_shopName } = req.body;

  // vlaidation - not emapty
  if (
    [s_username, s_email, s_name, password, s_address, s_shopName].some(
      (fields) => fields?.trim() === ""
    )
  ) {
    throw new ApiError(500, "All fields are required");
  }
  
  // is seller exists alerady
  const isSellerpresent = await Seller.findOne({
    $or: [{ s_username }, { s_email }],
  });

  if (isSellerpresent) {
    throw new ApiError(500, "Seller exists with this email");
  }

  //getting localpath of the files //check for images and avtars
  console.log(req.files);
  const avatarLocalPath = req.files?.s_avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.s_coverImage) &&
    req.files.s_coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.s_coverImage[0].path;
  }
  if (!avatarLocalPath) {
    throw new ApiError(500, "Not found seller Avatar path");
  }

  console.log(avatarLocalPath, coverImageLocalPath);
  const s_avatar = await uploadOnCloudinary(avatarLocalPath);

  const s_coverImage = await uploadOnCloudinary(coverImageLocalPath);

  console.log("cv", s_coverImage, "av", s_avatar);
  if (!s_avatar) {
    throw new ApiError(500, "Seller Avtar not found");
  }

  //create seller object entry in mongodb

  const newSeller = await Seller.create({
    s_username: s_username.toLowerCase(),
    s_email,
    s_name,
    s_shopName,
    s_address,
    password,
    s_avatar: s_avatar.url,
    s_coverImage: s_coverImage ? s_coverImage.url : "",
  });

  //removing password and refersh token from response
  const seller = await Seller.findById(newSeller._id).select(
    "-password -refreshToken"
  );

  //check for seller creation
  console.log(seller);
  if (!seller) {
    throw new ApiError(
      500,
      "Something went worng while registering the Seller!!"
    );
  }

  //return res
  return res
    .status(201)
    .json(new ApiResponse(200, seller, "Seller Registerd Successfully"));
});



export {registerSeller}