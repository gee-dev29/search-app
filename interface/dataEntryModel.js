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
            type: Number,
            required: true,
        },
        churchURL: {
            type: String,
            required: true,
            validate: {
                validator: function (v) {
                    // Ensure the URL starts with 'http://', 'https://', or 'www'
                    return /^(https?:\/\/)?(www\.)?[^\s/$.?#].[^\s]*$/.test(v);
                },
                message: (props) =>
                    `${props.value} is not a valid URL! It should start with http://, https://, or www.`,
            },
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
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
            required: true,
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

export const dataEntryModel =  mongoose.model("dataEntry", dataEntrySchema);