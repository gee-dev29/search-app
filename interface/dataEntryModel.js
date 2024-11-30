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
    isChurchBranchAvailable: {
      type: Boolean,
      enum: ["yes", "no"],
      default: "no",
      required: true,
    },
    denomination: {
      type: String,
      required: true,
    },
    yearOfEstablishment: {
      type: Number,
      required: true,
      index: true,
    },
    churchURL: {
      type: String,
    },
    branchIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "branches",
        required: true,
      },
    ],
  },
  { timestamps: true }
);
dataEntrySchema.index({
  nameOfChurch: "text",
  generalOverseer: "text",
});

export const dataEntryModel = mongoose.model("churches", dataEntrySchema);
