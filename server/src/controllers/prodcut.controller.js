import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import RawProduct from "../models/rawProduct.model.js";
import { Seller } from "../models/seller.model.js";
import ReadyProduct from "../models/readyProduct.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addRawProduct = asyncHandler(async (req, res) => {
  const seller_id = req.seller._id.toString();
  // console.log(seller_id);
  const { p_id, p_name, p_title, p_description } = req.body;

  if (
    [p_id, p_name, p_title, p_description, seller_id].some(
      (fields) => fields?.trim() === ""
    )
  ) {
    throw new ApiError(500, "All fields are Required!!");
  }

  const isSellerExists = await Seller.findOne({ _id: seller_id });

  if (!isSellerExists) {
    throw new ApiError(500, "Invalid Seller!!");
  }

  const isExist = await RawProduct.findOne({ $or: [{ p_id }, { p_name }] });

  if (isExist) {
    throw new ApiError(500, "Given name or id already exists!!");
  }

  const productImageLocalPath = req.files?.productImage[0]?.path;
  
  if (!productImageLocalPath) {
    throw new ApiError(500, "Not found Product Image Path");
  }

  //upload image and avatar in cloudinary
  // console.log(productImageLocalPath)
  const productImage = await uploadOnCloudinary(productImageLocalPath);
  

  //  console.log( "pI", productImage)
  if (!productImage) {
    throw new ApiError(500, "ProdcutImage not found");
  }





  const rawProdcutInstance = await RawProduct.create({
    created_by: seller_id,
    p_id,
    p_name,
    p_title,
    p_description,
    p_image:productImage.url
  });

  if (!rawProdcutInstance) {
    throw new ApiError(500, "Error in creation of Raw Prodcut!!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        201,
        rawProdcutInstance,
        "Raw Product created Successfully!!!"
      )
    );
});

const addReadyProduct = asyncHandler(async (req, res) => {
  const seller = req.seller._id.toString();
  const { rawProduct, p_mrp, p_discount, p_addedQuantity } = req.body;

  if ([rawProduct].some((fields) => fields?.trim() === "")) {
    throw new ApiError(500, "All the fields are required!");
  }

  if (p_mrp === null || p_mrp === 0) {
    throw new ApiError(500, "MRP can't be empty or 0");
  }
  if (p_addedQuantity === null || p_addedQuantity === 0) {
    throw new ApiError(500, "Added Quantity can't be empty or 0");
  }

  const isRawProductExist = await RawProduct.findOne({ _id: rawProduct });

  if (!isRawProductExist) {
    throw new ApiError(500, "Raw Product not found!!");
  }

  const readyProductIsntance = await ReadyProduct.create({
    seller,
    rawProduct,
    p_mrp,
    p_discount,
    p_addedQuantity,
  });

  if (!readyProductIsntance)
    throw new ApiError(
      500,
      "Something went wrong in creating the ReadyProdcut!!"
    );

  return res
    .status(200)
    .json(
      new ApiResponse(
        201,
        readyProductIsntance,
        "ReadyProduct created Successfully!!"
      )
    );
});

const updateProduct = asyncHandler(async (req, res) => {
  const seller = req.seller._id;

  const { readyProduct, addedStock, new_mrp, new_discount } = req.body;

  if (readyProduct === "") {
    throw new ApiError(500, "Please Select a Product!!!");
  }

  // if (addedStock === null || addedStock === undefined) {
  //   throw new ApiError(500, "addedStock cant be null or undefinded!!");
  // }

  const isReadyProductExist = await ReadyProduct.findOne({ _id: readyProduct });

  if (!isReadyProductExist) {
    throw new ApiError(500, "Product Not Found!!");
  }


  if(isReadyProductExist.seller.toString()!= seller.toString()){
    throw new ApiError(400, "This product is now added by the login seller!!");
  }

  
  isReadyProductExist.p_addedQuantity =
    isReadyProductExist.p_addedQuantity + (addedStock ? addedStock : 0);

  isReadyProductExist.p_mrp = new_mrp ? new_mrp : isReadyProductExist.p_mrp;

  isReadyProductExist.p_discount = new_discount ? new_discount : isReadyProductExist.p_discount;

  
  isReadyProductExist.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        201,
        isReadyProductExist,
        "Ready Prodcut Quanttity updated successfully!!"
      )
    );
});

const getAllProducts= asyncHandler(async(req,res)=>{
  const allProducts = await ReadyProduct.find()
    .populate({
        path: 'rawProduct'
    })
    .populate({
        path: 'seller',
        select: '-password -refreshToken' // Exclude fields from seller
    });

  if(!allProducts){
    throw new ApiError(500, "Something went wrong in fetching Prodcuts!!!")
  }

  // allProducts=allProducts.select("-seller.password -seller.refreshTo")

  return res.status(200).json(new ApiResponse(201, allProducts, "Got All Prodcuts!!"))
})


export { addRawProduct, addReadyProduct, updateProduct, getAllProducts };
