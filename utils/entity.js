// const { model, default: mongoose } = require("mongoose");
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import moment from "moment";
// this function checks if the user data is correct

// Encrypt function
function encryptData(text, key) {
    const cipher = crypto.createCipher("aes-256-cbc", key);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
}

// Decrypt function
function decryptData(encryptedText, key) {
    const decipher = crypto.createDecipher("aes-256-cbc", key);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}

const updateDataById = async (id, payload, model) => {
    return await model.findByIdAndUpdate(id, payload, { new: true });
};
const updateData = async (ip, payload, model) => {
    return await model.findOneAndUpdate(ip , payload, { new: true });
};

const updateArrayOfData = async (id, payload, model) => {
    return await model.updateOne(id, { $push: payload });
};

const deleteDataById = async (id, model) => {
    return await model.findByIdAndDelete(id);
};

const updateUserByEmail = async (email, payload, model) => {
    return await model.updateOne({ email: email }, payload, { new: true });
};

// encrypt user password
const encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const HashPassword = await bcrypt.hash(password, salt);
    return HashPassword;
};

// decrypt password
const decryptPassword = async (password, user) => {
    return await bcrypt.compare(password, user.password);
};

// Document upload
const checkUploadDoc = async (body) => {
    const { file } = body;
    if (file == "") {
        return null;
    }
    return body;
};

const jwtSign = (id) => {
    const token = jwt.sign(
        {
            userId: id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "2hr",
        }
    );
    return token;
};

// generate Otp
const generateOtp = () => {
    const value = Math.random().toString().substr(2, 4);
    const expiresIn = new Date(Date.now() + 10 * 60 * 1000);
    return { otp: value, expiresIn: expiresIn };
};
const getAllFilteredData = async (model, filter) => {
    const data = await model.find(filter).sort({ createdAt: -1 });
    return data;
};

const checkMissingFieldsInput = (requiredFields, requestBody) => {
    const missingOrEmptyFields = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    requiredFields.forEach((field) => {
        const value = requestBody[field];
        if (
            !requestBody.hasOwnProperty(field) ||
            value === null ||
            value === undefined ||
            value === ""
        ) {
            missingOrEmptyFields.push(field);
        } else if (field === "email" && !emailRegex.test(value)) {
            missingOrEmptyFields.push(`${field} (invalid email)`);
        }
    });

    if (missingOrEmptyFields.length > 0) {
        return {
            result: false,
            message: `Missing required fields: ${missingOrEmptyFields.join(
                ", "
            )}`,
        };
    }

    return {
        result: true,
    };
};
const getSingleData = async (model, id) => {
    try {
        const data = await model.findById(id);
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
};

const isValidUUID = (id) => {
    const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
};

const isValidObjectId = (id) => {
    const isValid = mongoose.Types.ObjectId.isValid({ id: id });
    return isValid;
};

const getPaginatedData = async (model, filter, skip, limit) => {
    const data = await model.find(filter).limit(limit).skip(skip);
    const totalRecords = data.length;
    return { data, totalRecords };
};
export {
    encryptPassword,
    decryptPassword,
    jwtSign,
    getAllFilteredData,
    checkUploadDoc,
    updateUserByEmail,
    checkMissingFieldsInput,
    updateDataById,
    deleteDataById,
    updateArrayOfData,
    encryptData,
    decryptData,
    generateOtp,
    isValidUUID,
    isValidObjectId,
    getSingleData,
    getPaginatedData,
    updateData,
};
