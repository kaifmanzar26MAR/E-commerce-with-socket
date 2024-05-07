import { Router } from "express";
import { getAllUsers, getCurrentUser, getUserById, loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();
router.route("/registeruser").post(upload.fields([
    {
        name:"avatar",
        maxCount:1
    },
    {
        name:"coverImage",
        maxCoutn:1
    }
]), registerUser);
router.route("/loginuser").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/getoneuser").post(getUserById);
router.route("/getallusers").get(getAllUsers);
//secured routes

router.route("/refreshToken").post(refreshAccessToken);
router.route("/current-user").get(verifyJWT, getCurrentUser);

export default router;
