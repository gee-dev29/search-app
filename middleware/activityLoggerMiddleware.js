import { logActivity } from "../controller/activityController.js";

export const activityLogger = (title, content) => {
    return async (req, res, next) => {
        try {
            await logActivity(req, title, content);
            next();
        } catch (error) {
            next(error);
        }
    };
};
