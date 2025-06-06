import express from "express";
import { jwtVerify } from "../middleware/jwtAuthentication.js";
import { checkUser } from "../middleware/checkUser.js";
import { getApprovalData, updateApprovalStatus } from "../controller/approvalController.js";
import { superAdminRoleCheck } from "../middleware/checkRole.js";
const router = express.Router();

router.route("/").get(jwtVerify, checkUser, getApprovalData);

router
  .route("/approvalStatus/:id")
  .patch(jwtVerify, checkUser, superAdminRoleCheck, updateApprovalStatus);

export default router;
