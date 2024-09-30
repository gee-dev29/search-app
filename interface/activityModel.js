import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
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
        }
    },
    { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);