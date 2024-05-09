import { Router } from "express";
import { addRawProduct } from "../controllers/prodcut.controller.js";
import { verifySellerJWT } from "../middleware/sellerAuth.middleware.js";

const router = Router();
router.route("/addrawproduct").post(verifySellerJWT,addRawProduct); 

export default router;
