import { approvalModel } from "../interface/approvalModel.js";
import { getPaginatedDataWithMultiplePopulate } from "../utils/entity.js";

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
