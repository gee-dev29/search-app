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
    nameOfBranchPastor: {
      type: String,
      index: true,
    },
    pastorName: {
      type: String,
    },
    pastorPhoneNo: {
      type: String,
    },
    pastorPosition: {
      type: String,
    },
    denomination: {
      type: String,
      required: true,
    },
    branchPopulation: {
      type: String,
    },
    yearOfEstablishment: {
      type: Number,
      required: true,
      index: true,
    },
    churchURL: {
      type: String,
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
    },
    continent: {
      type: String,
      required: true,
    },
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
