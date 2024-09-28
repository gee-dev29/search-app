import { logActivity } from "../controller/activityController.js";

export const activityLogger = (title, content, sender, receiver) => {
    try {
        return async (next) => {
            const creatorId = req.userId;
            await logActivity(creatorId, title, content, sender, receiver);
            next();
        };
    } catch (error) {
        return next(error)
    }
};