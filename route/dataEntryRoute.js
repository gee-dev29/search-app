import express from "express";
import { checkUser } from "../middleware/checkUser.js";
import {
    createDataEntry,
    getAllDataEntryById,
    getAllDataEntryOrById,
} from "../controller/dataEntryController.js";
import { jwtVerify } from "../middleware/jwtAuthentification.js";
const router = express.Router();

router.route("/").post(jwtVerify, checkUser, createDataEntry);
// router.route("/:id?").get(jwtVerify, checkUser, getAllDataEntryById);
router.route("/:id?").get(jwtVerify, checkUser, getAllDataEntryOrById);

export default router;
