import express from "express";
import { jwtVerify } from "../middleware/jwtAuthentification.js";
import { searchData } from "../controller/dataEntryController.js";
import { searchDataLimiter } from "../middleware/searchDataLimiter.js";
const router = express.Router();

router.route("/search-data").get(jwtVerify, searchDataLimiter, searchData);

export default router;
