import { activityModel } from "../interface/activityModel.js";
export const logActivity = async (req, res, title, content) => {
    try {
        const activity = new activityModel({
            creatorId: req.id,
            title: title,
            content: content,
            sender: req.id,
        });
        await activity.save();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
