import {
  checkMissingFieldsInput,
  getAllFilteredData,
  getAllFilteredPopulatedData,
  getPaginatedData,
  getPaginatedDataWithPopulate,
  updateDataById,
} from "../utils/entity.js";
import { dataEntryField } from "../utils/inputField.js";
import { churchModel } from "../models/churchModel.js";
import { userModel } from "../models/userModel.js";
import { ApprovalStatus } from "../enums/approvalStatus.js";
import { branchesModel } from "../models/churchBranchesModel.js";
import { approvalModel } from "../models/approvalModel.js";
import lunr from "lunr";
import { searchDatabase } from "./searchController.js";
import { logActivity } from "../utils/ActivityLogger.js";
import { ActivityLogType } from "../enums/ActivityLogType.js";
import mongoose from "mongoose";

// add  data enter entry and update data entry
export const createChurchEntry = async (req, res) => {
  try {
    const { _id, ...others } = req.body;
    const userId = req.userId;
    const user = req.user;

    if (_id) {
      const churchPayload = {
        ...others,
      };
      await updateDataById(_id, churchPayload, churchModel);
      return res.status(200).json({ message: "Church updated successfully" });
    }

    const { nameOfChurch, generalOverseer, churchURL } = req.body;
    const checkFields = checkMissingFieldsInput(dataEntryField, req.body);

    if (!checkFields.result) {
      return res.status(400).json({
        message: checkFields.message,
      });
    }

    const dataEntry = await churchModel.findOne({
      generalOverseer: generalOverseer.toLowerCase(),
      churchURL: churchURL.toLowerCase(),
      nameOfChurch: nameOfChurch.toLowerCase(),
    });

    if (dataEntry) {
      return res.status(400).json({
        message: "Data entry already exists",
      });
    }

    const newDataEntry = new churchModel({
      creatorId: userId,
      ...req.body,
    });

    const result = await newDataEntry.save();

    const approvalData = new approvalModel({
      creatorId: userId,
      churchId: result._id,
      type: "church",
    });

    await approvalData.save();
    await logActivity({
      by: user._id,
      description: user.fullName + " " + "Logged in",
      eventType: ActivityLogType.Church_entry_update,
      properties: user,
      on: user,
    });
    return res.status(200).json({ message: "Data created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createBranchEntry = async (req, res) => {
  try {
    const { _id, churchId, ...others } = req.body;
    const userId = req.userId;
    const user = req.user;

    if (!_id) {
      const branchData = new branchesModel({
        creatorId: userId,
        churchId: churchId,
        ...others,
      });
      // Save the branch
      const branchResult = await branchData.save();

      const approvalData = new approvalModel({
        creatorId: userId,
        churchId: churchId,
        branchId: branchResult._id,
        type: "branch",
      });
      await approvalData.save();

      await logActivity({
        by: user._id,
        description: user.fullName + " " + "Logged in",
        eventType: ActivityLogType.Branch_entry_create,
        properties: user,
        on: user,
      });
      return res.status(200).json({ message: "Branch created successfully" });
    }

    const branchPayload = {
      churchId: churchId,
      ...others,
    };
    await updateDataById(_id, branchPayload, branchesModel);
    await logActivity({
      by: user._id,
      description: user.fullName + " " + "Logged in",
      eventType: ActivityLogType.Branch_entry_edit,
      properties: user,
      on: user,
    });
    return res.status(200).json({ message: "Branch updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all data entry or get single data entry by Id
export const getAllUserDataEntry = async (req, res) => {
  try {
    const { status } = req.query;
    let filter;
    if (status && status !== "all") {
      filter = {
        creatorId: req.userId,
        approvalStatus: status,
      };
    } else {
      filter = {
        creatorId: req.userId,
      };
    }
    const result = await getAllFilteredData(churchModel, filter);
    return res.status(200).json({ payload: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getDataByStatus = async (req, res) => {
  try {
    const { status, limit, skip } = req.query;

    if (!(status || limit || skip)) {
      return res
        .status(400)
        .json({ message: " Query parameters are required" });
    }
    let filter;
    if (status == "all") {
      filter = {};
    } else {
      filter = { approvalStatus: status };
    }
    const dataEntries = await getPaginatedDataWithPopulate(
      churchModel,
      filter,
      skip,
      limit,
      "creatorId",
      "user"
    );
    return res.status(200).json({ payload: dataEntries });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getDataEntry = async (req, res) => {
  const id = req.params.id;
  const filter = {
    _id: id,
  };

  const data = await getAllFilteredPopulatedData(
    churchModel,
    filter,
    "creatorId",
    "user"
  );
  const branchFilter = {
    churchId: id,
  };

  const findAllBranches = await getAllFilteredData(branchesModel, branchFilter);

  return res
    .status(200)
    .json({ payload: { data: data[0], branches: findAllBranches } });
};

export const getMyAnalytics = async (req, res) => {
  try {
    const id = req.id;

    const statuses = ["pending", "approved", "rejected"];
    const counts = {};

    for (const status of statuses) {
      counts[status] = await churchModel.countDocuments({
        creatorId: id,
        approvalStatus: status,
      });
    }

    const totalEntries = await churchModel.countDocuments({
      creatorId: id,
    });

    return res.status(200).json({ payload: { ...counts, totalEntries } });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllAnalytics = async (req, res) => {
  try {
    const counts = {};
    const roles = ["admin", "super admin"];

    const totalEntries = await churchModel.countDocuments({});

    for (const role of roles) {
      counts[role] = await userModel.countDocuments({
        role: role,
      });
    }

    return res.status(200).json({ payload: { ...counts, totalEntries } });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const searchData = async (req, res) => {
  try {
    const query = req.query.q;
    const results = await searchDatabase(query);
    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllChurches = async (req, res) => {
  try {
    let filter = { approvalStatus: ApprovalStatus.APPROVED };

    const allChurches = await getAllFilteredData(churchModel, filter);

    return res.status(200).json({
      payload: allChurches,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const getAllBranches = async (req, res) => {
  try {
    const filter = {
      churchId: req.query.id,
    };

    const allBranches = await getAllFilteredPopulatedData(
      branchesModel,
      filter,
      "creatorId",
      userModel
    );

    return res.status(200).json({
      payload: allBranches,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const getBranchById = async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) {
      return res.status(400).json({ message: "Branch id is required" });
    }
    const results = await branchesModel.findById(id);
    res.status(200).json({ results });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// approve data entry or decline data entry
export const updateBranchStatus = async (req, res) => {
  try {
    const { approvalStatus, id } = req.body;
    const payload = {
      approvalStatus: approvalStatus,
    };
    const user = req.user;

    await updateDataById(id, payload, branchesModel).then(async () => {
      await logActivity({
        by: user._id,
        description: user.fullName + " " + "Logged in",
        eventType: ActivityLogType.Branch_entry_update,
        properties: user,
        on: user,
      });
      return res.status(200).json({
        message: "success",
      });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// approve data entry or decline data entry
export const getSearchById = async (req, res) => {
  try {
    const { id } = req.query;
    // Ensure the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // First, try to find the Church by ID
    let result = await churchModel.findById(id);
    if (result) {
      return res.status(200).json({ type: "church", data: result });
    }

    // If no Church is found, try to find the Branch by ID and populate the churchId
    result = await branchesModel
      .findById(id)
      .populate("churchId") // Populate the churchId field with the full church data
      .exec();

    if (result) {
      return res.status(200).json({ type: "branch", data: result });
    }

    // If neither is found, throw an error
    return res
      .status(400)
      .json({ message: "No Church or Branch found with the provided ID" });
  } catch (error) {
    console.error(error);
    return null; // Or handle the error appropriately
  }
};
