import mongoose from "mongoose";
import { ApprovalStatus } from "../enums/approvalStatus.js";

const churchModelSchema = new mongoose.Schema(
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
    churchInfo: {
      type: String,
    },
    pictures: {
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
churchModelSchema.index({
  nameOfChurch: "text",
  generalOverseer: "text",
});

export const churchModel = mongoose.model("churches", churchModelSchema);
