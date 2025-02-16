import express from "express";
import { checkUser } from "../middleware/checkUser.js";
import {
  createBranchEntry,
  createChurchEntry,
  getAllAnalytics,
  getAllChurches,
  getAllUserDataEntry,
  getBranchById,
  getDataByStatus,
  getDataEntry,
  getMyAnalytics,

} from "../controller/dataEntryController.js";
import { jwtVerify } from "../middleware/jwtAuthentification.js";
import { superAdminRoleCheck } from "../middleware/checkRole.js";
const router = express.Router();

router.route("/church").post(jwtVerify, checkUser, createChurchEntry);
router.route("/branch").post(jwtVerify, checkUser, createBranchEntry);
router.route("/").get(jwtVerify, checkUser, getAllUserDataEntry);
router
  .route("/entry")
  .get(jwtVerify, checkUser, superAdminRoleCheck, getDataByStatus);

router.route("/entry/:id").get(jwtVerify, checkUser, getDataEntry);
router.route("/branch/:id").get(jwtVerify, checkUser, getBranchById);

router.route("/my-analytics").get(jwtVerify, checkUser, getMyAnalytics);
router.route("/churches").get(jwtVerify, checkUser, getAllChurches);

router.route("/analytics").get(jwtVerify, checkUser, getAllAnalytics);
export default router;
