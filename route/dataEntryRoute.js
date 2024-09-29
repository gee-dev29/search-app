import express from "express";
import { checkUser } from "../middleware/checkUser.js";
import {
    approveOrRejectDataEntry,
    createDataEntry,
    getAllDataEntryOrById,
    getDataByStatus,
    searchData,
} from "../controller/dataEntryController.js";
import { jwtVerify } from "../middleware/jwtAuthentification.js";
import { superAdminRoleCheck } from "../middleware/checkRole.js";
const router = express.Router();

router.route("/").post(jwtVerify, checkUser, createDataEntry);
// router.route("/:id?").get(jwtVerify, checkUser, getAllDataEntryOrById);
router
    .route("/approvalStatus/:approvalStatus")
    .get(jwtVerify, superAdminRoleCheck, getDataByStatus);
router
    .route("/approvalStatus/:id")
    .patch(jwtVerify, superAdminRoleCheck, approveOrRejectDataEntry);
export default router;
