import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import RawProduct from "../models/rawProduct.model.js";
import { Seller } from "../models/seller.model.js";

const addRawProduct = asyncHandler(async (req, res) => {
  const seller_id = (req.seller._id).toString();
  console.log(seller_id)
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

  const rawProdcutInstance = await RawProduct.create({
    created_by: seller_id,
    p_id,
    p_name,
    p_title,
    p_description,
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

export { addRawProduct };
