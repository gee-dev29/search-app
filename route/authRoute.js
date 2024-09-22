import express from "express";
import {
    loginUser,
    registerUser,
    verifyOTP,
    viewSingleUser,
} from "../controller/userController.js";
import { jwtVerify } from "../middleware/jwtAuthentification.js";
import { superAdminRoleCheck } from "../middleware/checkRole.js";
import { findUserByEmail } from "../middleware/findUserByEmail.js";
import { checkUser } from "../middleware/checkUser.js";

const router = express.Router();

router.route("/register").post(jwtVerify, superAdminRoleCheck, registerUser);
router.route("/login").post(findUserByEmail, loginUser);
router.route("/verify-otp").post(findUserByEmail, verifyOTP);
// router.route("/").get(jwtVerify, checkUser, viewSingleUser)

export default router;