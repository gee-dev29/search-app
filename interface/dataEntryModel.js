import mongoose from "mongoose";
import { ApprovalStatus } from "../enums/approvalStatus.js";

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
            index: true
        },
        nameOfGO: {
            type: String,
            required: true,
            index: true
        },
        nameOfCurrentPastor: {
            type: String,
            required: true,
            index: true
        },
        pastorPhoneNo: {
            type: String,
            required: true,
        },
        pastorPosition: {
            type: String,
            required: true,
        },
        denomination: {
            type: String,
            required: true,
        },
        branchPopulation: {
            type: String,
            required: true,
        },
        yearOfEstablishment: {
            type: Number,
            required: true,
            index: true
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
        approvalStatus: {
            type: String,
            enum: [
                ApprovalStatus.APPROVED,
                ApprovalStatus.REJECTED,
                ApprovalStatus.PENDING,
            ],
            default: ApprovalStatus.PENDING,
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

export const dataEntryModel = mongoose.model("dataEntry", dataEntrySchema);