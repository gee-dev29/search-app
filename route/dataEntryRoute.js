import express from "express";
import { checkUser } from "../middleware/checkUser.js";
import {
  approveOrRejectDataEntry,
  createDataEntry,
  getAllUserDataEntry,
  getDataByStatus,
} from "../controller/dataEntryController.js";
import { jwtVerify } from "../middleware/jwtAuthentification.js";
import { superAdminRoleCheck } from "../middleware/checkRole.js";
import { activityLogger } from "../middleware/activityLoggerMiddleware.js";
const router = express.Router();

router.route("/").post(jwtVerify, checkUser, createDataEntry);
router.route("/").get(jwtVerify, checkUser, getAllUserDataEntry);
router
  .route("/entry/:approvalStatus")
  .get(jwtVerify, checkUser, superAdminRoleCheck, getDataByStatus);
router
  .route("/approvalStatus/:id")
  .patch(jwtVerify, checkUser, superAdminRoleCheck, approveOrRejectDataEntry);

export default router;
