import express from "express";
import { checkUser } from "../middleware/checkUser.js";
import {
  createDataEntry,
  getAllUserDataEntry,
  getDataByStatus,
  getDataEntry,
  updateApprovalStatus,
} from "../controller/dataEntryController.js";
import { jwtVerify } from "../middleware/jwtAuthentification.js";
import { superAdminRoleCheck } from "../middleware/checkRole.js";
const router = express.Router();

router.route("/").post(jwtVerify, checkUser, createDataEntry);
router.route("/").get(jwtVerify, checkUser, getAllUserDataEntry);
router
  .route("/entry")
  .get(jwtVerify, checkUser, superAdminRoleCheck, getDataByStatus);
router
  .route("/approvalStatus/:id")
  .patch(jwtVerify, checkUser, superAdminRoleCheck, updateApprovalStatus);
router
  .route("/entry/:id")
  .get(jwtVerify, checkUser, superAdminRoleCheck, getDataEntry);

export default router;
