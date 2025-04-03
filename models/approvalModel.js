import mongoose from "mongoose";
import { ApprovalStatus } from "../enums/approvalStatus.js";

const approvalSchema = new mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    type: {
      type: String,
      enum: ['church', 'branch']
    },
    churchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "churches",
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "branches",
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
  },
  { timestamps: true }
);

export const approvalModel = mongoose.model("approval", approvalSchema);
