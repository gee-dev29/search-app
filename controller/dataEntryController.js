import {
    checkMissingFieldsInput,
    getAllFilteredData,
    getSingleData,
    updateDataById,
} from "../utils/entity.js";
import { dataEntryField } from "../utils/inputField.js";
import { dataEntryModel } from "../interface/dataEntryModel.js";
import { userModel } from "../interface/userModel.js";

// add  data enter entry and update data entry
export const createDataEntry = async (req, res) => {
    try {
        const id = req.body.id;
        if (id) {
            const result = await updateDataById(id, req.body, dataEntryModel);
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

        const checkFields = checkMissingFieldsInput(dataEntryField, req.body);
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

        const newDataEntry = new dataEntryModel({
            creatorId: userId,
            nameOfChurch: nameOfChurch.toLowerCase(),
            nameOfGO: nameOfGO.toLowerCase(),
            denomination: denomination.toLowerCase(),
            yearOfEstablishment: yearOfEstablishment,
            churchURL: churchURL.toLowerCase(),
            socialMediaPage: socialMediaPage,
            continent: continent.toLowerCase(),
            churchAddress: {
                country: country.toLowerCase(),
                state: state.toLowerCase(),
                city: city.toLowerCase(),
                street: street.toLowerCase(),
                postalCode: postalCode.toLowerCase(),
            },
        });

        await newDataEntry.save();
        return res.status(200).json({ message: "Data created successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
// Get all data entry or get single data entry by Id
export const getAllDataEntryOrById = async (req, res) => {
    try {
        const id = req.params.id;
        if (id) {
            const results = await getSingleData(dataEntryModel, id);

            const entriesWithUserNames = await Promise.all(
                results.map(async (entry) => {
                    const creator = await userModel.findById(entry.creatorId);
                    const creatorName = creator.fullName;

                    return {
                        ...entry._doc,
                        userName: creatorName,
                    };
                })
            );
            return res.status(200).json({
                payload: entriesWithUserNames,
            });
        }
        const dataEntries = await getAllFilteredData(dataEntryModel, {});
        const entriesWithUserNames = await Promise.all(
            dataEntries.map(async (entry) => {
                const creator = await userModel.findById(entry.creatorId);
                const creatorName = creator.fullName;
                return {
                    ...entry._doc,
                    userName: creatorName,
                };
            })
        );
        return res.status(200).json({ payload: entriesWithUserNames });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getDataByStatus = async (req, res) => {
    try {
        const status = req.params.status;
        console.log(status);
        if (!status) {
            return res
                .status(400)
                .json({ message: "Status parameter is required" });
        }
        const payload = await getAllFilteredData(dataEntryModel, {
            status: status,
        });

        console.log(payload);
        if (!payload || payload.length === 0) {
            return res.status(204).json({
                payload: [],
            });
        }
        return res.status(200).json({
            payload: payload,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
