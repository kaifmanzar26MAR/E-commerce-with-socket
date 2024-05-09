import { Router } from "express";
import { addRawProduct, addReadyProduct, getAllProducts, getProdcutById, updateProduct } from "../controllers/prodcut.controller.js";
import { verifySellerJWT } from "../middleware/sellerAuth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();
router.route("/addrawproduct").post(verifySellerJWT,upload.fields([
    {
        name:"productImage",
        maxCount:1
    }
]),addRawProduct); 
router.route("/addreadyproduct").post(verifySellerJWT,addReadyProduct);
router.route('/updatestockquantity').post(verifySellerJWT,updateProduct);

router.route('/getallproducts').get(getAllProducts)
router.route('/getproductbyid/:_id').get(getProdcutById);

export default router;
