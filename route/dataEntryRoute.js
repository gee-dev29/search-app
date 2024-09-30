import express from "express";
import { checkUser } from "../middleware/checkUser.js";
import {
    approveOrRejectDataEntry,
    createDataEntry,
    getDataByStatus,
} from "../controller/dataEntryController.js";
import { jwtVerify } from "../middleware/jwtAuthentification.js";
import { superAdminRoleCheck } from "../middleware/checkRole.js";
import { activityLogger } from "../middleware/activityLoggerMiddleware.js";
const router = express.Router();

router.route("/").post(jwtVerify, checkUser, createDataEntry, (req, res, next) => activityLogger("Data Entry", "Church data Entry successful"));
// router.route("/:id?").get(jwtVerify, checkUser, getAllDataEntryOrById);
router
    .route("/approvalStatus/:approvalStatus")
    .get(jwtVerify, superAdminRoleCheck, getDataByStatus);
router
    .route("/approvalStatus/:id")
    .patch(jwtVerify, superAdminRoleCheck, approveOrRejectDataEntry);
export default router;
