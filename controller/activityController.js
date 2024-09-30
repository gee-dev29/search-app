import activityModel from "../interface/activityModel.js";

export const logActivity = async (title, content, sender, receiver) => {
    try {
        
        const activity = new activityModel({
            creatorId: req.id,
            title: title,
            content: content,
            sender: sender,
        });
        await activity.save();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
