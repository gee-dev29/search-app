import express from "express";
import { jwtVerify } from "../middleware/jwtAuthentification.js";
import { checkUser } from "../middleware/checkUser.js";
import { getApporvalData, updateApprovalStatus } from "../controller/approvalController.js";
import { superAdminRoleCheck } from "../middleware/checkRole.js";
const router = express.Router();

router.route("/").get(jwtVerify, checkUser, getApporvalData);

router
  .route("/approvalStatus/:id")
  .patch(jwtVerify, checkUser, superAdminRoleCheck, updateApprovalStatus);

export default router;
