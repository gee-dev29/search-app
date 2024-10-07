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

// add  data enter entry and update data entry
export const createDataEntry = async (req, res) => {
  try {
    const { _id } = req.body;
    if (_id) {
      const result = await updateDataById(
        _id,
        { ...req.body, approvalStatus: ApprovalStatus.PENDING },
        dataEntryModel
      );

      // await logActivity(id, "Data Entry Update");
      if (!result) {
        return res.status(404).json({ message: "id not found" });
      }
      return res
        .status(200)
        .json({ message: "data entry updated successfully" });
    }
    const userId = req.userId;
    const { nameOfChurch, generalOverseer, churchURL } = req.body;

    const checkFields = checkMissingFieldsInput(dataEntryField, req.body);
    if (!checkFields.result) {
      return res.status(400).json({
        message: checkFields.message,
      });
    }

    const dataEntry = await dataEntryModel.findOne({
      //   yearOfEstablishment,
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

    await newDataEntry.save();
    return res.status(200).json({ message: "Data created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// approve data entry or decline data entry
export const updateApprovalStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { approvalStatus } = req.body;

    const payload = {
      approvalStatus: approvalStatus,
    };
    await updateDataById(id, payload, dataEntryModel).then(() => {
      return res.status(200).json({
        message: "success",
      });
    });
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

  return res.status(200).json({ payload: data[0] });
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

    const totalEntries = await dataEntryModel.countDocuments({ creatorId: id });

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
    let filter;
    const {
      nameOfChurch,
      generalOverseer,
      country,
      state,
      city,
      nameOfBranchPastor,
      skip,
      limit,
    } = req.query;

    if (
      nameOfChurch 
    ) {
      filter = {
        $text: { $search: nameOfChurch },
        approvalStatus: ApprovalStatus.APPROVED,
      };
    }
    // if (generalOverseer) {
    //   filter = {
    //     $text: { $search: generalOverseer },
    //     approvalStatus: ApprovalStatus.APPROVED,
    //   };
    // }
    // if (nameOfBranchPastor) {
    //   filter = {
    //     $text: { $search: nameOfBranchPastor },
    //     approvalStatus: ApprovalStatus.APPROVED,
    //   };
    // }

    const retrivedData = await getPaginatedData(
      dataEntryModel,
      filter,
      skip,
      limit
    );
    return res.status(200).json({ payload: retrivedData });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
