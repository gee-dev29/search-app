import { logActivity } from "../controller/activityController.js";

export const activityLogger = (title, content, sender) => {
    try {
        return async (next) => {
            await logActivity(title, content, sender);
            next();
        };
    } catch (error) {
        return next(error);
    }
};
