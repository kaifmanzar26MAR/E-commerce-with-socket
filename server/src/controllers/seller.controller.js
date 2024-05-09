import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Seller } from "../models/seller.model.js";



function containsHTMLTags(email) {
  const htmlRegex = /<[^>]*>/; // Regular expression to match HTML tags
  return htmlRegex.test(email);
}



const registerSeller = asyncHandler(async (req, res) => {
  //get seller details form frontend
  const { s_username, s_email, s_name, password, s_address, s_shopName } =
    req.body;

  // vlaidation - not emapty
  if (
    [s_username, s_email, s_name, password, s_address, s_shopName].some(
      (fields) => fields?.trim() === ""
    )
  ) {
    throw new ApiError(500, "All fields are required");
  }

  if(containsHTMLTags(s_username) || containsHTMLTags(s_email) || containsHTMLTags(s_name) || containsHTMLTags(s_shopName)){
    throw new ApiError(500, "Invalid Input!!")
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

const generateAccessAndRefreshTokens = async (sellerId) => {
  try {
    const seller = await Seller.findOne({ _id: sellerId });
    console.log(seller);
    const accessToken = await seller.generateAccessToken();
    const refreshToken = await seller.generateRefreshToken();
    seller.refreshToken = refreshToken;
    console.log(accessToken, refreshToken);
    await seller.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
    throw new ApiError(
      500,
      "Something went wrong while generation refersh and access token"
    );
  }
};



const loginSeller = asyncHandler(async (req, res) => {
  const { s_email, s_username, password } = req.body;

  if (!s_username || !s_email) {
    throw new ApiError(400, "s_username or s_eamil is required!!");
  }

  // const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s_email);
    if (containsHTMLTags(s_email) || containsHTMLTags(s_username)) {
        throw new ApiError(400, "Invalid email address");
    }

  const seller = await Seller.findOne({
    $or: [{ s_username }, { s_email }],
  });

  if (!seller) {
    throw new ApiError(500, "Seller does not exist!!");
  }

  const passwordCheck = await seller.isPasswordCorrect(password);

  if (!passwordCheck) {
    throw new ApiError(500, "Invalid seller credential");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    seller._id
  );

  const loggedInSeller = await Seller.findOne({ _id: seller._id }).select(
    "-password -refreshToken"
  );

  //sending cookies

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          seller: loggedInSeller,
          accessToken,
          refreshToken,
        },
        "Seller logged In Successfully"
      )
    );
});

export { registerSeller, loginSeller };
