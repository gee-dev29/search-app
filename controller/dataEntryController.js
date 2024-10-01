import {
    checkMissingFieldsInput,
    getAllFilteredData,
    getPaginatedData,
    getSingleData,
    updateDataById,
} from "../utils/entity.js";
import { dataEntryField } from "../utils/inputField.js";
import { dataEntryModel } from "../interface/dataEntryModel.js";
import { userModel } from "../interface/userModel.js";
import { ApprovalStatus } from "../enums/approvalStatus.js";

// add  data enter entry and update data entry
export const createDataEntry = async (req, res) => {
    try {
        if (req.userId) {
            const result = await updateDataById(id, req.body, dataEntryModel);

            await logActivity(id, "Data Entry Update");
            if (!result) {
                return res.status(404).json({ message: "id not found" });
            }
            return res
                .status(200)
                .json({ message: "data entry updated successfully" });
        }
        const userId = req.userId;
        const {
            nameOfChurch,
            nameOfGO,
            denomination,
            yearOfEstablishment,
            churchURL,
            socialMediaPage,
            continent,
            country,
            state,
            city,
            street,
            postalCode,
        } = req.body;

        const checkFields = checkMissingFieldsInput(dataEntryField, {...req.body, creatorId: res.userId});
        if (!checkFields.result) {
            return res.status(400).json({
                message: checkFields.message,
            });
        }

        const dataEntry = await dataEntryModel.findOne({
            yearOfEstablishment,
            nameOfGO: nameOfGO.toLowerCase(),
            churchURL: churchURL.toLowerCase(),
            nameOfChurch: nameOfChurch.toLowerCase(),
        });
        if (dataEntry) {
            return res.status(400).json({
                message: "Data entry already exists",
            });
        }

        const newDataEntry = new dataEntryModel(req.body);

        await newDataEntry.save();
        return res.status(200).json({ message: "Data created successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// approve data entry or decline data entry
export const approveOrRejectDataEntry = async (req, res) => {
    try {
        const id = req.params.id;
        const { approvalStatus } = req.body;

        if (
            approvalStatus !== ApprovalStatus.APPROVED &&
            approvalStatus !== ApprovalStatus.REJECTED
        ) {
            return res.status(400).json({ message: "Invalid approval status" });
        }
        const payload = {
            approvalStatus: approvalStatus,
        };
        await updateDataById(id, payload, dataEntryModel).then(() => {
            return res.status(200);
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
// Get all data entry or get single data entry by Id
export const getAllDataEntryOrById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res
                .status(400)
                .json({ message: "Data entry id is required" });
        }

        const filter = {
            _id: id,
        };
        const result = await getAllFilteredData(dataEntryModel, filter);
        return res.status(200).json({ payload: result[0] });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getDataByStatus = async (req, res) => {
    try {
        const { status, limit, skip } = req.params;
        if (!(status || limit || skip)) {
            return res
                .status(400)
                .json({ message: " Query parameters are required" });
        }
        const filter = { status: status };
        const dataEntries = await getPaginatedData(
            dataEntryModel,
            filter,
            skip,
            limit
        );
        return res.status(200).json({ payload: dataEntries });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// search data
export const searchData = async (req, res) => {
    try {
        let filter;
        const { nameOfChurch, nameOfGO, nameOfCurrentPastor, skip, limit } =
            req.query;

        if (nameOfChurch) {
            filter = { $text: { $search: nameOfChurch } };
        }
        if (nameOfGO) {
            filter = { $text: { $search: nameOfGO } };
        }
        if (nameOfCurrentPastor) {
            filter = { $text: { $search: nameOfCurrentPastor } };
        }

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
