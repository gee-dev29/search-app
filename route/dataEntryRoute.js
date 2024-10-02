import express from "express";
import { checkUser } from "../middleware/checkUser.js";
import {
  createDataEntry,
  getAllAnalytics,
  getAllUserDataEntry,
  getDataByStatus,
  getDataEntry,
  getMyAnalytics,
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
  .get(jwtVerify, checkUser, getDataEntry);

router
.route("/my-analytics")
.get(jwtVerify, checkUser, getMyAnalytics )

router
.route("/analytics")
.get(jwtVerify, checkUser, getAllAnalytics )
export default router;
