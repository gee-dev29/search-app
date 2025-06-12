import express from "express";
import { checkUser } from "../middleware/checkUser.js";
import {
  createBranchEntry,
  createChurchEntry,
  getAllAnalytics,
  getAllBranches,
  getAllChurches,
  getAllUserDataEntry,
  getBranches,
  getChurchAndBranchCountByMonth,
  getDataByStatus,
  getDataEntry,
  getMyAnalytics,
  updateBranchStatus,
} from "../controller/dataEntryController.js";
import { jwtVerify } from "../middleware/jwtAuthentication.js";
import { superAdminRoleCheck } from "../middleware/checkRole.js";
import { checkPermission } from "../middleware/checkPermission.js";
import { Permissions } from "../enums/permissions.js";

const router = express.Router();

// Routes for Church-related actions
router
  .route("/church")
  .post(
    jwtVerify,
    checkUser,
    checkPermission(Permissions.CREATE_CHURCH),
    createChurchEntry
  )
  .delete(
    jwtVerify,
    checkUser,
    checkPermission(Permissions.DELETE_CHURCH),
    createChurchEntry
  );
router.route("/churches").get(jwtVerify, checkUser, getAllChurches);

// Routes for Branch-related actions
router
  .route("/branch")
  .post(
    jwtVerify,
    checkUser,
    checkPermission(Permissions.CREATE_BRANCH),
    createBranchEntry
  );

router.route("/branch-status").patch(jwtVerify, checkUser, updateBranchStatus);
router.route("/all-branches").get(jwtVerify, checkUser, getAllBranches);
router.route("/branches").get(jwtVerify, checkUser, getBranches);

// General routes
router.route("/").get(jwtVerify, checkUser, getAllUserDataEntry);
router
  .route("/entry")
  .get(jwtVerify, checkUser, superAdminRoleCheck, getDataByStatus);
router
  .route("/entry/:id")
  .get(
    jwtVerify,
    checkUser,
    checkPermission(Permissions.VIEW_CHURCH),
    checkPermission(Permissions.VIEW_BRANCH),
    getDataEntry
  );

// Analytics routes
router.route("/my-analytics").get(jwtVerify, checkUser, getMyAnalytics);
router.route("/analytics").get(jwtVerify, checkUser, getAllAnalytics);
router.route("/graph").get( getChurchAndBranchCountByMonth);


export default router;
