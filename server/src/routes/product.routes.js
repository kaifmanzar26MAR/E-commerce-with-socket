import { Router } from "express";
import { addRawProduct, addReadyProduct, updateProduct } from "../controllers/prodcut.controller.js";
import { verifySellerJWT } from "../middleware/sellerAuth.middleware.js";

const router = Router();
router.route("/addrawproduct").post(verifySellerJWT,addRawProduct); 
router.route("/addreadyproduct").post(verifySellerJWT,addReadyProduct);
router.route('/updatestockquantity').post(verifySellerJWT,updateProduct);

export default router;
