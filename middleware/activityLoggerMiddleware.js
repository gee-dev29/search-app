import { logActivity } from "../controller/activityController.js";

export const activityLogger = (title, content, sender, receiver) => {
    try {
        return async (next) => {
            await logActivity(title, content, sender, receiver);
            next();
        };
    } catch (error) {
        return next(error);
    }
};
