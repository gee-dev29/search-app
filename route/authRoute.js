import express from "express";
import { loginUser, registerAdmin, verifyOTP } from "../controller/userController.js";
import { jwtVerify } from "../middleware/jwtAuthentication.js";
import { superAdminRoleCheck } from "../middleware/checkRole.js";
import { findUserByEmail } from "../middleware/findUserByEmail.js";
import { checkUser } from "../middleware/checkUser.js";
import { checkPermission } from '../middleware/checkPermission.js';
import { Permissions } from "../enums/permissions.js";

const router = express.Router();

router.route("/register").post(jwtVerify, checkUser, superAdminRoleCheck, checkPermission(Permissions.CREATE_USER), registerAdmin);
router.route("/login").post(findUserByEmail, loginUser);
router.route("/verify").post(findUserByEmail, verifyOTP);

export default router;
