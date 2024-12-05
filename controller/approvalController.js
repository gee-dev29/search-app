import { approvalModel } from "../interface/approvalModel.js";
import { branchesModel } from "../interface/churchBranchesModel.js";
import { dataEntryModel } from "../interface/dataEntryModel.js";
import {
  getPaginatedDataWithMultiplePopulate,
  updateDataById,
} from "../utils/entity.js";

export const getApporvalData = async (req, res) => {
  try {
    const { status, skip, limit } = req.query;
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
    const result = await getPaginatedDataWithMultiplePopulate(
      approvalModel,
      filter,
      skip,
      limit,
      ["creatorId", "churchId", "branchId"],
      ["user", "churches", "branches"]
    );
    return res.status(200).json({ payload: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// approve data entry or decline data entry
export const updateApprovalStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { approvalStatus } = req.body;
    const approvalData = await approvalModel.findById(id)
    const payload = {
      approvalStatus: approvalStatus,
    };
     await updateDataById(id, payload, approvalModel);

    if (approvalData.type == "church") {
      await updateDataById(approvalData.churchId, payload, dataEntryModel).then(
        () => {
          return res.status(200).json({
            message: "success",
          });
        }
      );
    } else {
      await updateDataById(approvalData.branchId, payload, branchesModel).then(
        () => {
          return res.status(200).json({
            message: "success",
          });
        }
      );
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
