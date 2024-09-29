import rateLimit from "express-rate-limit"

export const searchDataLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Too many requests, please try again in 15 minutes time.",
});