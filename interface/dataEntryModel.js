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
      index: true,
    },
    generalOverseer: {
      type: String,
      required: true,
      index: true,
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
    denomination: {
      type: String,
      required: true,
    },
    socialMediaPage: {
      type: Array,
    },
    yearOfEstablishment: {
      type: Number,
      required: true,
      index: true,
    },
    churchURL: {
      type: String,
    },
  },
  { timestamps: true }
);
dataEntrySchema.index({
  nameOfChurch: "text",
  generalOverseer: "text",
});

export const dataEntryModel = mongoose.model("churches", dataEntrySchema);
