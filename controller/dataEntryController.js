import dataEntryModel from "../interface/dataEntryModel.js";
import { entity } from "../utils/entity.js";
import { dataEntryField } from "../utils/inputField.js";

export const createDataEntry = async (req, res) => {
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

// Get all data entry
export const getAllDataEntry = async (req, res) => {
    try {
        const dataEntry = await dataEntryModel.find();
        console.log(dataEntry);
        return res.status(200).json(dataEntry);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// get all data entry by id
export const getDataEntryById = async (req, res) => {
    try {
        const userId = req.userId;
        const dataEntry = await dataEntryModel.findById(userId);
        return res.status(200).json(dataEntry);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
