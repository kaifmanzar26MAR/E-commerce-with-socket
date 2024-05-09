import { Router } from "express";
import { registerSeller } from "../controllers/seller.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();
router.route("/sellerregister").post(upload.fields([
    {
        name:"s_avatar",
        maxCount:1
    },
    {
        name:"s_coverImage",
        maxCoutn:1
    }
]),registerSeller);

export default router;
