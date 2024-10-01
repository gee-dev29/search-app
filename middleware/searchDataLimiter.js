import rateLimit from "express-rate-limit";
import { banIPAddress } from "../controller/banController.js";

export const searchDataLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    handler: banIPAddress,
});
