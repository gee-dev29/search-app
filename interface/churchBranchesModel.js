import mongoose from "mongoose";
import { ApprovalStatus } from "../enums/approvalStatus.js";

const branchesSchema = new mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    churchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "churches",
    },
    branchName: {
      type: String,
      index: true,
    },
    city: {
      type: String,
      index: true,
    },
    state: {
      type: String,
      index: true,
    },
    country: {
      type: String,
      index: true,
    },

    street: {
      type: String,
    },
    nameOfBranchPastor: {
      type: String,
      index: true,
    },
    adminName: {
      type: String,
    },
    adminPhoneNo: {
      type: String,
    },
    adminPosition: {
      type: String,
    },
    branchPopulation: {
      type: String,
    },
    branchChurchURL: {
      type: String,
    },

    continent: {
      type: String,
      required: true,
    },

    coordinates: {
      type: Array,
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

branchesSchema.index({
  nameOfBranchPastor: "text",
  branchName: "text",
  country: "text",
  continent: "text",
  state: "text",
  city: "text",
});

export const branchesModel = mongoose.model("branches", branchesSchema);
