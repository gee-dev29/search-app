import mongoose from "mongoose";

const dataEntrySchema = new mongoose.Schema(
    {
        creatorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        nameOfChurch: {
            type: String,
            required: true,
        },
        nameOfGO: {
            type: String,
            required: true,
        },
        denomination: {
            type: String,
            required: true,
        },
        yearOfEstablishment: {
            type: String,
            required: true,
        },
        churchURL: {
            type: String,
            required: true,
        },
        socialMediaPage: {
            type: Array,
            required: true,
        },
        continent: {
            type: String,
            required: true,
        },
        churchAddress: {
            country: {
                type: String,
                required: true,
            },
            state: {
                type: String,
                required: true,
            },
            city: {
                type: String,
                required: true,
            },
            street: {
                type: String,
                required: true,
            },
            postalCode: {
                type: String,
                required: true,
            },
        },
        isApproved: {
            type: Boolean,
            default: false,
        },
        isChurchBranchAvailable: {
            type: Boolean,
            enum: ["yes", "no"],
            default: "no",
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("dataEntry", dataEntrySchema);
