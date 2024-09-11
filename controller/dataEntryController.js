import dataEntryModel from "../interface/dataEntryModel.js";
import { userModel } from "../interface/userModel.js";
import { entity } from "../utils/entity.js";
import { dataEntryField } from "../utils/inputField.js";

export const createDataEntry = async (req, res) => {
    try {
        const id = req.body.id;
        if (id) {
            const result = await entity.updateDataById(
                id,
                req.body,
                dataEntryModel
            );
            if (!result) {
                return res.status(404).json({ message: "id not found" });
            }
            return res
                .status(204)
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

        const checkFields = entity.checkMissingFieldsInput(
            dataEntryField,
            req.body
        );
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

// edit data entry
export const editDataEntry = async (req, res) => {
    try {
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
        const checkFields = entity.checkMissingFieldsInput(
            dataEntryField,
            req.body
        );
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
        if (!dataEntry) {
            return res.status(400).json({
                message: "Data entry not found",
            });
        }

        dataEntry.nameOfChurch = nameOfChurch.toLowerCase();
        dataEntry.nameOfGO = nameOfGO.toLowerCase();
        dataEntry.denomination = denomination.toLowerCase();
        dataEntry.yearOfEstablishment = yearOfEstablishment;
        dataEntry.churchURL = churchURL.toLowerCase();
        dataEntry.socialMediaPage = socialMediaPage;
        dataEntry.continent = continent.toLowerCase();
        dataEntry.churchAddress = {
            country: country.toLowerCase(),
            state: state.toLowerCase(),
            city: city.toLowerCase(),
            street: street.toLowerCase(),
            postalCode: postalCode.toLowerCase(),
        };

        await dataEntry.save();
        return res.status(200).json({ message: "Data updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
// Get all data entry
export const getAllDataEntry = async (req, res) => {
    try {
        const { id, status } = req.params;
        if (id || status) {
            const result = await entity.getAllFilteredData(dataEntryModel, {
                creatorId: id,
                status: status,
            });
            return res.status(200).json({
                payload: result,
            });
        }
        const dataEntry = await dataEntryModel.find();
        console.log(dataEntry);
        return res.status(200).json({ payload: dataEntry });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
