import express from "express";
import { checkUser } from "../middleware/checkUser.js";
import { createDataEntry } from "../controller/dataEntryController.js";
const router = express.Router();

router.route("/").post(checkUser, createDataEntry);

export default router;
