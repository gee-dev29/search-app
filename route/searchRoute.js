import express from "express";
import { searchData } from "../controller/dataEntryController.js";
const router = express.Router();

router.route("/").get(
    // searchDataLimiter,
    // activityLogger(
    //     "Search Data Entry",
    //     "Search for Church data Entry successful"
    // ),
    searchData
);

export default router;
