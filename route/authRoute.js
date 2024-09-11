import express from "express";
import {
    loginUser,
    registerUser,
    verifyOTP,
} from "../controller/userController.js";
import { checkUser } from "../middleware/checkUser.js";
import { jwtVerify } from "../middleware/jwtAuthentification.js";
import { superAdminRoleCheck } from "../middleware/checkRole.js";

const router = express.Router();

router.route("/register").post(jwtVerify, superAdminRoleCheck, registerUser);
router.route("/login").post(loginUser);
router.route("/:id/verify-otp").post(checkUser, verifyOTP);

export default router;
