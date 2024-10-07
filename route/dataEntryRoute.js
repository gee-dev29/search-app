import express from "express";
import { checkUser } from "../middleware/checkUser.js";
import {
    approveOrRejectDataEntry,
    createDataEntry,
    getAllDataEntryOrById,
    getDataByStatus,
} from "../controller/dataEntryController.js";
import { jwtVerify } from "../middleware/jwtAuthentification.js";
import { superAdminRoleCheck } from "../middleware/checkRole.js";
import { activityLogger } from "../middleware/activityLoggerMiddleware.js";
const router = express.Router();
router
    .route("/")
    .post(
        jwtVerify,
        checkUser,
        activityLogger(
            "Add Data Entry",
            `data Entry of church added successfully`
        ),
        createDataEntry
    );
router.route("/:id?").get(jwtVerify, checkUser, getAllDataEntryOrById);
router
    .route("/approvalStatus/:approvalStatus")
    .get(jwtVerify, superAdminRoleCheck, getDataByStatus);
router
    .route("/approvalStatus/:id")
    .patch(
        jwtVerify,
        superAdminRoleCheck,
        activityLogger(
            "Search Data Entry",
            "Search for Church data Entry successful"
        ),
        approveOrRejectDataEntry
    );
export default router;
