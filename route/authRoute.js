import express from "express";
import {
    loginUser,
    registerUser,
    verifyOTP,
} from "../controller/userController.js";
import { checkUser } from "../middleware/checkUser.js";
import { jwtVerify } from "../middleware/jwtAuthentification.js";
import { superAdminRoleCheck } from "../middleware/checkRole.js";
import { findUserByEmail } from "../middleware/findUserByEmail.js";

const router = express.Router();

router.route("/register").post(jwtVerify, superAdminRoleCheck, registerUser);
router.route("/login").post(findUserByEmail, loginUser);
router.route("/verify-otp").post(findUserByEmail, verifyOTP);

export default router;
