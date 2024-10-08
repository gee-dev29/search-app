import express from "express";
import { loginUser, registerAdmin } from "../controller/userController.js";
import { jwtVerify } from "../middleware/jwtAuthentification.js";
import { superAdminRoleCheck } from "../middleware/checkRole.js";
import { findUserByEmail } from "../middleware/findUserByEmail.js";
import { checkUser } from "../middleware/checkUser.js";

const router = express.Router();

router
  .route("/register")
  .post(jwtVerify, checkUser, superAdminRoleCheck, registerAdmin);
router.route("/login").post(findUserByEmail, loginUser);

export default router;
