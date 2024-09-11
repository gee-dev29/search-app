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

        const dataEntry = await dataEntryModel
            .find()
            .where("yearOfEstablishment")
            .equals(yearOfEstablishment)
            .where("nameOfGEO")
            .equals(nameOfGO)
            .where("country")
            .equals(country)
            .where("nameOfChurch")
            .equals(nameOfChurch);
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
            yearOfEstablishment: yearOfEstablishment, // No need to lowercase numbers
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
