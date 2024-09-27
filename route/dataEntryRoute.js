import express from "express";
import { checkUser } from "../middleware/checkUser.js";
import {
    createDataEntry,
    getAllDataEntryOrById,
    getDataByStatus,
} from "../controller/dataEntryController.js";
import { jwtVerify } from "../middleware/jwtAuthentification.js";
const router = express.Router();

router.route("/").post(jwtVerify, checkUser, createDataEntry);
router.route("/:id?").get(jwtVerify, checkUser, getAllDataEntryOrById);
router.route("/status/:status").get(jwtVerify, checkUser, getDataByStatus);

export default router;
