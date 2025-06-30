import { approvalModel } from "../models/approvalModel.js";
import { branchesModel } from "../models/churchBranchesModel.js";
import { churchModel } from "../models/churchModel.js";
import {
  getFilteredDataWithMultiplePopulate,
  updateDataById,
} from "../utils/entity.js";

export const getApprovalData = async (req, res) => {
  try {
    const { status } = req.query;
    let filter;
    if (status && status !== "all") {
      filter = {
        approvalStatus: status,
      };
    } else {
      filter = {
      };
    }
    const result = await getFilteredDataWithMultiplePopulate(
      approvalModel,
      filter,
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
      await updateDataById(approvalData.churchId, payload, churchModel).then(
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
