import express from "express";
import { jwtVerify } from "../middleware/jwtAuthentification.js";
import { searchData } from "../controller/dataEntryController.js";
import { searchDataLimiter } from "../middleware/searchDataLimiter.js";
import { activityLogger } from "../middleware/activityLoggerMiddleware.js";
const router = express.Router();

router
    .route("/search-data")
    .get(
        jwtVerify,
        searchDataLimiter,
        activityLogger(
            "Search Data Entry",
            "Search for Church data Entry successful"
        ),
        searchData
    );

export default router;
