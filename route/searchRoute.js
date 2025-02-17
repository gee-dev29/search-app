import express from "express";
import { getSearchById, searchData } from "../controller/dataEntryController.js";
const router = express.Router();

router.route("/").get(searchData);
router.route("/searchId").get(getSearchById);

export default router;
