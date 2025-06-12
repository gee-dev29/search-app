import {
  checkMissingFieldsInput,
  deleteDataById,
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
import { redisClient } from "../connection/redisConnection.js";

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

export const deleteChurch = async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) {
      return res.status(400).json({ message: "Church id is required" });
    }
    const church = await deleteDataById(id, churchModel);
    if (!church) {
      return res.status(404).json({ message: "Church not found" });
    }
    await logActivity({
      by: req.user._id,
      description: req.user.fullName + " " + "Deleted a church",
      eventType: ActivityLogType.Church_entry_delete,
      properties: req.user,
      on: church,
    });
    return res.status(200).json({ message: "Church deleted successfully" });
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
    const { status } = req.query;

    let filter;
    if (!status || status == "all") {
      filter = {};
    } else {
      filter = { approvalStatus: status };
    }
    const dataEntries = await getAllFilteredPopulatedData(
      churchModel,
      filter,
      "creatorId",
      "user"
    );

    const key = "churches:" + status;
    const cachedResult = await redisClient.get(key);
    if (cachedResult) {
      return res.status(200).json({ payload: JSON.parse(cachedResult) });
    }
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

    const churchEntries = await churchModel.countDocuments({});
    const branchEntries = await branchesModel.countDocuments({});
    const pendingChurchEntries = await churchModel.countDocuments({
      approvalStatus: ApprovalStatus.PENDING,
    });
    const pendingBranchesEntries = await branchesModel.countDocuments({
      approvalStatus: ApprovalStatus.PENDING,
    });
    const approvedChurchEntries = await churchModel.countDocuments({
      approvalStatus: ApprovalStatus.APPROVED,
    });
    const approvedBranchesEntries = await branchesModel.countDocuments({
      approvalStatus: ApprovalStatus.APPROVED,
    });

    const rejectedChurchEntries = await churchModel.countDocuments({
      approvalStatus: ApprovalStatus.REJECTED,
    });

    const rejectedBranchesEntries = await churchModel.countDocuments({
      approvalStatus: ApprovalStatus.REJECTED,
    });

    const totalPendingData = pendingBranchesEntries + pendingChurchEntries;
    const totalRejectedData = rejectedBranchesEntries + rejectedChurchEntries;
    const totalApprovedData = approvedBranchesEntries + approvedChurchEntries;

    const totalEntries = churchEntries + branchEntries;

    for (const role of roles) {
      counts[role] = await userModel.countDocuments({
        role: role,
      });
    }

    return res.status(200).json({
      payload: {
        ...counts,
        totalEntries,
        totalPendingData,
        totalRejectedData,
        totalApprovedData
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const searchData = async (req, res) => {
  try {
    const query = req.query.q;
    const key = "search:" + query.toLowerCase();
    const value = await redisClient.get(key);
    if (value) {
      return res.json({ results: JSON.parse(value) });
    } else {
      const results = await searchDatabase(query);
      // Store the results in Redis with an expiration time of 1 hour
      await redisClient.set(key, JSON.stringify(results), {
        EX: 3600, // 1 hour
      });
      return res.json({ results });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllChurches = async (req, res) => {
  try {
    let filter = { approvalStatus: ApprovalStatus.APPROVED };

    const allChurches = await getAllFilteredData(churchModel, filter);
    const key = "allChurches";
    const cachedResult = await redisClient.get(key);
    if (cachedResult) {
      return res.status(200).json({ payload: JSON.parse(cachedResult) });
    }

    return res.status(200).json({
      payload: allChurches,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const getBranches = async (req, res) => {
  try {
    const { status } = req.query;

    if (!status) {
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
    const dataEntries = await getAllFilteredPopulatedData(
      branchesModel,
      filter,
      "creatorId",
      "user"
    );

    const key = "branches:" + status;
    const cachedResult = await redisClient.get(key);
    if (cachedResult) {
      return res.status(200).json({ payload: JSON.parse(cachedResult) });
    }
    return res.status(200).json({ payload: dataEntries });
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

    const key = "searchById:" + id;
    const cachedResult = await redisClient.get(key);
    if (cachedResult) {
      return res.status(200).json(JSON.parse(cachedResult));
    }
    // First, try to find the Church by ID
    let result = await churchModel.findById(id);
    if (result) {
      const branches = await branchesModel.find({ churchId: result._id });
      const combinedData = { ...result.toObject(), branches };
      return res.status(200).json({ type: "church", data: combinedData });
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

export const getChurchAndBranchCountByMonth = async (req, res) => {
  try {
    const year = req.query.year;

    if (!year || isNaN(year)) {
      return res.status(400).json({ message: "Invalid year provided." });
    }

    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

    // Helper to run aggregation
    const getMonthlyCounts = async (Model) => {
      return Model.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startDate,
              $lte: endDate,
            },
          },
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            month: "$_id",
            count: 1,
            _id: 0,
          },
        },
        {
          $sort: { month: 1 },
        },
      ]);
    };

    const [churchResults, branchResults] = await Promise.all([
      getMonthlyCounts(churchModel),
      getMonthlyCounts(branchesModel),
    ]);

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const monthNumber = i + 1;

      const church = churchResults.find((r) => r.month === monthNumber);
      const branch = branchResults.find((r) => r.month === monthNumber);

      return {
        month: monthNames[i],
        churches: church ? church.count : 0,
        branches: branch ? branch.count : 0,
      };
    });

    return res.status(200).json({ data: monthlyData });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
