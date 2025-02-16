import express from "express";
import { checkUser } from "../middleware/checkUser.js";
import {
  createBranchEntry,
  createChurchEntry,
  getAllAnalytics,
  getAllBranches,
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

// Routes for Church-related actions
router.route("/church").post(jwtVerify, checkUser, createChurchEntry);
router.route("/churches").get(jwtVerify, checkUser, getAllChurches);

// Routes for Branch-related actions
router.route("/branch").post(jwtVerify, checkUser, createBranchEntry);
router.route("/branch/:id").get(jwtVerify, checkUser, getBranchById); // Correcting GET for individual branch by ID
router.route("/all-branches").get(jwtVerify, checkUser, getAllBranches);

// General routes
router.route("/").get(jwtVerify, checkUser, getAllUserDataEntry);
router.route("/entry").get(jwtVerify, checkUser, superAdminRoleCheck, getDataByStatus);
router.route("/entry/:id").get(jwtVerify, checkUser, getDataEntry);

// Analytics routes
router.route("/my-analytics").get(jwtVerify, checkUser, getMyAnalytics);
router.route("/analytics").get(jwtVerify, checkUser, getAllAnalytics);

export default router;
