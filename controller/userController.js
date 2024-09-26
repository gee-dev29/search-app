import { UserStatus } from "../enums/statusEnum.js";
import resetPasswordTemplate from "../emailService/template/template.js";
import { sendEmail } from "../emailService/email.js";
import { messages } from "../message/messageEnum.js";
import {
    adminRegisterField,
    loginField,
    registerField,
    updateField,
    verifyOTPField,
} from "../utils/inputField.js";
import {
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
    getSingleData,
} from "../utils/entity.js";
import { Role } from "../enums/role.js";
import notificationModel from "../interface/notificationModel.js";
import { userModel } from "../interface/userModel.js";
import { isValidObjectId } from "mongoose";

export const registerUser = async (req, res) => {
    try {
        const { fullName, phone, email, password, role } = req.body;
        const checkFields = checkMissingFieldsInput(registerField, req.body);
        if (!checkFields.result) {
            return res.status(400).json({
                message: checkFields.message,
            });
        }
        const otp = generateOtp();
        const hashPassword = await encryptPassword(password);

        const user = new userModel({
            fullName: fullName,
            email: email,
            password: hashPassword,
            phone: phone,
            role: role,
            otp: otp,
        });
        await user.save();
        return res.status(201).json({
            message: "user created successfuly",
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const checkFields = checkMissingFieldsInput(loginField, req.body);

        if (!checkFields.result) {
            return res.status(400).json({
                message: checkFields.message,
            });
        }

        const user = req.user;
        const isPasswordValid = await decryptPassword(password, user);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        const payload = {
            id: user._id,
            role: user.role,
        };
        const token = jwtSign(payload);
        return res.status(200).json({
            message: "User login successful",
            payload: {
                id: user._id,
                email: user.email,
                role: user.role,
                token: token,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: error.message,
        });
    }
};

//get user
export const viewSingleUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const data = await getSingleData(userModel, userId);
        return res.status(200).json({ payload: data });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const viewUserByRole = async (req, res) => {
    try {
        const role = req.role;
        const users = await getAllFilteredData(userModel, { role: role });
        return res.status(200).json({ payload: users });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const viewAllUsers = async (req, res) => {
    try {
        const role = req.params.role;
        if (role) {
            const users = await getAllFilteredData(userModel, { role: role });
            return res.status(200).json({ payload: users });
        }
        const users = await getAllFilteredData(userModel, {});
        return res.status(200).json({ payload: users });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

//delete User
export const deleteUser = async (req, res) => {
    try {
        const userId = req.userId;
        await deleteDataById(userId, userModel);
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {}
};

//suspend a user
export const toggleSuspendUser = async (req, res) => {
    try {
        const userId = req.userId;
        if (user.status == UserStatus.ACTIVE) {
            const payload = {
                status: UserStatus.SUSPENDED,
            };
            await updateDataById(userId, payload, userModel);
            return res.status(200).json({
                message: "user suspended successfully",
            });
        }
        const payload = {
            status: UserStatus.ACTIVE,
        };
        await updateDataById(userId, payload, userModel);
        return res.status(200).json({
            message: "user activated successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

//update user
export const updateUser = async (req, res) => {
    try {
        const user = req.user;
        const { phone, address, profilePicture } = req.body;
        const checkFields = checkMissingFieldsInput(updateField, req.body);
        if (!checkFields.result) {
            return res.status(400).json({
                message: checkFields.message,
            });
        }
        const payload = {
            phone: phone,
            address: address,
            profilePicture: profilePicture,
        };
        await updateDataById(user._id, payload, userModel);
        return res.status(200).json({
            message: "user updated successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
// forgot password
export const forgotPassword = async (req, res) => {
    try {
        
        const user = req.user;
        const { email } = req.body;
        const token = jwtSign(user._id);
        const encrypedToken = encryptData(token, process.env.encrypedToken);
        const text = resetPasswordTemplate(encrypedToken, user.fullName);
        const emailMessage = {
            recieverEmail: email,
            subject: "Forgot Password verification",
            text: text,
        };
        sendEmail(emailMessage);
        res.status(200).json({
            message: "An email has been sent to your mailbox",
        });
    } catch (error) {
        return errorHandler(error, res);
    }
};

export const verifyOTP = async (req, res) => {
    try {
        const { otp, email } = req.body;
        const checkFields = checkMissingFieldsInput(verifyOTPField, req.body);
        if (!checkFields.result) {
            return res.status(400).json({
                message: checkFields.message,
            });
        }
        const _doc = req.user;
        if (otp !== _doc.otp.otp) {
            return res.status(400).json({
                message: "Invalid OTP",
            });
        } else {
            const updateData = {
                isVerified: true,
            };
            await updateDataById(_doc._id, updateData, userModel).then(() => {
                const emailMessage = {
                    recieverEmail: email,
                    subject: "Account verification successful",
                    text: `Hello ${_doc.fullName}. ${messages.VERIFIED_OTP}`,
                };
                const payload = {
                    id: _doc._id,
                    role: _doc.role,
                };
                const token = jwtSign(payload);
                sendEmail(emailMessage);
                return res.status(200).json({
                    message: "OTP verification successful",
                    token: token,
                });
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
export const sendRegistrationEmails = (email, fullName, otp) => {
    const otpMessage = {
        recieverEmail: email,
        subject: "Verify Otp",
        text: `Hello ${fullName}. Your OTP is ${otp.otp}. ${messages.OTP}`,
    };

    const emailMessage = {
        recieverEmail: email,
        subject: "New Registration",
        text: `Hello ${fullName}. ${messages.REGISTRATION}`,
    };

    sendEmail(emailMessage);
    sendEmail(otpMessage);
};

export const sendNotificationEmails = (
    adminEmail,
    adminFullName,
    newAdminEmail,
    newAdminFullName
) => {
    // Notification email for the Super Admin
    const superAdminNotification = {
        recieverEmail: adminEmail,
        subject: "New Admin Registered",
        text: `Hello ${adminFullName}. You have successfully registered ${newAdminFullName} as a new admin. ${messages.REGISTRATION}`,
    };

    // Welcome email for the newly registered Admin
    const newAdminNotification = {
        recieverEmail: newAdminEmail,
        subject: "Welcome to the Admin Team",
        text: `Hello ${newAdminFullName}. You have been successfully registered by ${adminFullName}. ${messages.REGISTRATION}`,
    };

    // Send both notification emails concurrently using Promise.all
    return Promise.all([
        sendEmail(superAdminNotification),
        sendEmail(newAdminNotification),
    ]);
};
