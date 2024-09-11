import express from "express";
import { checkUser } from "../middleware/checkUser.js";
import {
    createDataEntry,
    getAllDataEntry,
    getDataEntryById,
} from "../controller/dataEntryController.js";
import { jwtVerify } from "../middleware/jwtAuthentification.js";
const router = express.Router();

router.route("/").post(checkUser, createDataEntry);
router.route("/").get(jwtVerify, getAllDataEntry);
router
    .route("/:id")
    .get(jwtVerify, checkUser, getDataEntryById);

export default router;
