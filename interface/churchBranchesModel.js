import mongoose from "mongoose";
import { ApprovalStatus } from "../enums/approvalStatus.js";

const branchesSchema = new mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    chruchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "churches",
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
    socialMediaPage: {
      type: Array,
    },
    continent: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      index: true,
    },
    state: {
      type: String,
      index: true,
    },
    city: {
      type: String,
      index: true,
    },
    street: {
      type: String,
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
  country: "text",
  continent: "text",
  state: "text",
  city: "text",
});

export const branchesModel = mongoose.model("branches", branchesSchema);
