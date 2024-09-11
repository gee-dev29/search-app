import express from "express";
import { checkUser } from "../middleware/checkUser.js";
import {
    createDataEntry,
    getAllDataEntry,
} from "../controller/dataEntryController.js";
import { jwtVerify } from "../middleware/jwtAuthentification.js";
const router = express.Router();

router.route("/").post(jwtVerify, checkUser, createDataEntry);
router.route("/:id?/:status?").get(jwtVerify, checkUser, getAllDataEntry);

export default router;
