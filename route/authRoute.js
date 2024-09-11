import express from "express";
import {
    loginUser,
    registerAdmin,
    registerUser,
    verifyOTP,
} from "../controller/userController.js";
import { checkUser } from "../middleware/checkUser.js";

// import { checkUser } from "../middleware/checkUser.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login/:id").post(checkUser,loginUser);
router.route("/register-admin/:id").post(checkUser, registerAdmin);
router.route("/:id/verify-otp").post(checkUser, verifyOTP);

export default router;
