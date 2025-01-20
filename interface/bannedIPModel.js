import mongoose from "mongoose";

const bannedIpSchema = new mongoose.Schema({
    ipAddress: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^([0-9a-f]{1,4}:){7}[0-9a-f]{1,4}$/.test(
                    v
                );
            },
            message: (props) => `${props.value} is not a valid IP address!`,
        },
    },
    reason: {
        type: String,
        required: true,
    },
    bannedAt: {
        type: Date,
        default: Date.now,
    },
    offenseCount: {
        type: Number,
        default: 0,
    },
});

export const bannedIpModel = mongoose.model("BannedIp", bannedIpSchema);
