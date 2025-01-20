import { activityModel } from "../interface/activityModel.js";

export const activityLogger = (title, content) => {
    return async (req, res, next) => {
        try {
            const creatorId = req.id;
            console.log({ creatorId: creatorId });

            const activity = new activityModel({
                creatorId: creatorId,
                title: title,
                content: content,
            });

            await activity.save();
            next();
        } catch (error) {
            next(error);
        }
    };
};
