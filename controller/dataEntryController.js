import {
  checkMissingFieldsInput,
  getAllFilteredData,
  getAllFilteredPopulatedData,
  getPaginatedData,
  getPaginatedDataWithPopulate,
  updateDataById,
} from "../utils/entity.js";
import { dataEntryField } from "../utils/inputField.js";
import { dataEntryModel } from "../interface/dataEntryModel.js";
import { userModel } from "../interface/userModel.js";
import { ApprovalStatus } from "../enums/approvalStatus.js";
import { branchesModel } from "../interface/churchBranchesModel.js";
import { approvalModel } from "../interface/approvalModel.js";

// add  data enter entry and update data entry
export const createChurchEntry = async (req, res) => {
  try {
    const { _id, ...others } = req.body;
    const userId = req.userId;

    if (_id) {
      const churchPayload = {
        ...others,
      };
      await updateDataById(_id, churchPayload, dataEntryModel);
      return res.status(200).json({ message: "Church updated successfully" });
    }

    const { nameOfChurch, generalOverseer, churchURL } = req.body;
    const checkFields = checkMissingFieldsInput(dataEntryField, req.body);

    if (!checkFields.result) {
      return res.status(400).json({
        message: checkFields.message,
      });
    }

    const dataEntry = await dataEntryModel.findOne({
      generalOverseer: generalOverseer.toLowerCase(),
      churchURL: churchURL.toLowerCase(),
      nameOfChurch: nameOfChurch.toLowerCase(),
    });

    if (dataEntry) {
      return res.status(400).json({
        message: "Data entry already exists",
      });
    }

    const newDataEntry = new dataEntryModel({
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

    return res.status(200).json({ message: "Data created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createBranchEntry = async (req, res) => {
  try {
    const { _id, churchId, ...others } = req.body;
    const userId = req.userId;

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

      return res.status(200).json({ message: "Branch created successfully" });
    }

    const branchPayload = {
      churchId: churchId,
      ...others,
    };
    await updateDataById(_id, branchPayload, branchesModel);

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
    const result = await getAllFilteredData(dataEntryModel, filter);
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
      dataEntryModel,
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
    dataEntryModel,
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
      counts[status] = await dataEntryModel.countDocuments({
        creatorId: id,
        approvalStatus: status,
      });
    }

    const totalEntries = await dataEntryModel.countDocuments({
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

    const totalEntries = await dataEntryModel.countDocuments({});

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
    const {
      country,
      state,
      city,
      nameOfChurch,
      yearOfEstablishment,
      generalOverseer,
      nameOfBranchPastor,
      skip = 0,
      limit = 10,
      sortField = "nameOfChurch",
      sortOrder = "asc",
    } = req.query;

    // Initialize the church filter with default approval status
    let churchFilter = { approvalStatus: ApprovalStatus.APPROVED };

    // Dynamically build filter for church fields
    const churchSearchFields = {
      nameOfChurch,
      generalOverseer,
      yearOfEstablishment,
    };

    // Add case-insensitive regex search for church fields
    Object.entries(churchSearchFields).forEach(([key, value]) => {
      if (value && value.trim()) {
        if (key === "yearOfEstablishment") {
          churchFilter[key] = Number(value);
        } else {
          churchFilter[key] = { $regex: value.trim(), $options: "i" }; // Case-insensitive search with trimmed value
        }
      }
    });

    // Sorting: ensure valid sort field and order for churches
    const sortOptions = {
      [sortField]: sortOrder === "asc" ? 1 : -1,
    };

    // Fetch paginated data for churches
    const retrievedChurches = await getPaginatedData(
      dataEntryModel,
      churchFilter,
      skip,
      limit,
      sortOptions
    );

    // If no churches are found, return an empty branches array
    const churchIds = retrievedChurches.data.map((church) => church._id);
    if (churchIds.length === 0) {
      return res.status(200).json({
        payload: [],
      });
    }

    // Filter for branches by church IDs
    let branchFilter = {
      churchId: { $in: churchIds }, // Match branches related to the retrieved churches
      approvalStatus: ApprovalStatus.APPROVED,
    };

    // Optional: Paginate and filter branches with search criteria
    const branchSearchFields = {
      nameOfBranchPastor,
      country,
      state,
      city,
    };

    // Add case-insensitive regex search for branch fields
    Object.entries(branchSearchFields).forEach(([key, value]) => {
      if (value && value.trim()) {
        branchFilter[key] = { $regex: value.trim(), $options: "i" };
      }
    });

    // Fetch paginated data for branches
    const retrievedBranches = await getPaginatedData(
      branchesModel,
      branchFilter,
      skip,
      limit,
      sortOptions
    );

    // Merge church data with corresponding branches
    const churchesWithBranches = retrievedChurches.data.map((church) => {
      // Find the branches associated with the current church
      const branchesForChurch = retrievedBranches.data.filter(
        (branch) => branch.churchId.toString() === church._id.toString()
      );

      // Return the church data with the merged branches
      return {
        ...church.toObject(), // Convert Mongoose document to plain object
        branches: branchesForChurch, // Attach the branches
      };
    });

    // Return the merged data
    return res.status(200).json({
      payload: churchesWithBranches,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while processing the search request.",
      error: error.message,
    });
  }
};


export const getAllChurches = async (req, res) => {
  try {
    let filter = { approvalStatus: ApprovalStatus.APPROVED };

    const allChurches = await getAllFilteredData(dataEntryModel, filter);

    return res.status(200).json({
      payload: allChurches,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
