import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        creatorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        sender: {
            type: String,
            required: true,
        },
        receiver: {
            type: String,
            required: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);