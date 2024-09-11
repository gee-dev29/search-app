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
import { entity } from "../utils/entity.js";
import { Role } from "../enums/role.js";
import notificationModel from "../interface/notificationModel.js";
import { userModel } from "../interface/userModel.js";

export const registerUser = async (req, res) => {
    try {
        const { fullName, phone, email, password, role } = req.body;

        const checkFields = entity.checkMissingFieldsInput(
            registerField,
            req.body
        );
        if (!checkFields.result) {
            return res.status(400).json({
                message: checkFields.message,
            });
        }
        const otp = entity.generateOtp();
        const hashPassword = await entity.encryptPassword(password);
        let userRole = Role.USER;

        if (role && role !== Role.USER) {
            userRole = Role.SUPER_ADMIN;
            const user = new userModel({
                fullName: fullName,
                email: email,
                password: hashPassword,
                phone: phone,
                role: userRole,
                otp: otp,
            });
            sendRegistrationEmails(email, fullName, otp);
            await user.save();
            return res.status(201).json({
                message: "user created successfuly",
            });
        }

        const user = new userModel({
            fullName: fullName,
            email: email,
            password: hashPassword,
            phone: phone,
            role: userRole,
            otp: otp,
        });
        sendRegistrationEmails(email, fullName, otp);
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
//login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input fields
        const checkFields = entity.checkMissingFieldsInput(
            loginField,
            req.body
        );

        if (!checkFields.result) {
            return res.status(400).json({
                message: checkFields.message,
            });
        }

        // Find the user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await entity.decryptPassword(password, user);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        const otp = entity.generateOtp();
        const otpPayload = {
            otp: otp,
        };
        const _doc = req.user;
        console.log(otpPayload)
        await entity.updateUserByEmail(email, otpPayload, userModel);
        const otpMessage = {
            recieverEmail: email,
            subject: "Verify Otp",
            text: `Hello ${_doc.fullName}. Your OTP is ${otp.otp}. ${messages.OTP}`,
        };
        sendEmail(otpMessage);
        return res.status(200).json({
            message: "User login successful",
            payload: {
                id: user._id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: error.message,
        });
    }
};
// // Register Admin function
export const registerAdmin = async (req, res) => {
    try {
        const {
            fullName,
            email,
            password,
            phone,
            street,
            city,
            state,
            country,
            postalCode,
            role,
        } = req.body;
        const user = req.user;

        if (user.role !== Role.SUPER_ADMIN) {
            return res.status(403).json({
                message: "Only a Super Admin can register a new admin.",
            });
        }

        const checkFields = entity.checkMissingFieldsInput(
            adminRegisterField,
            req.body
        );
        if (!checkFields.result) {
            return res.status(400).json({
                message: checkFields.message,
            });
        }

        const otp = entity.generateOtp();
        const hashPassword = await entity.encryptPassword(password);

        const newAdmin = new userModel({
            fullName: fullName,
            email: email,
            password: hashPassword,
            phone: phone,
            otp: otp,
            address: {
                street: street,
                city: city,
                state: state,
                country: country,
                postalCode: postalCode,
            },
            role: Role.ADMIN,
        });

        sendRegistrationEmails(email, fullName, otp);

        await newAdmin.save();

        const notifications = [
            {
                creatorId: user._id,
                title: "New Admin Registered",
                content: `You have successfully registered ${fullName} as an admin.`,
                sender: user.email,
                receiver: user.email,
            },
            {
                creatorId: user._id,
                title: "Welcome to the Admin Team",
                content: `Hello ${fullName}, you have been registered as an admin.`,
                sender: user.email,
                receiver: email,
            },
        ];

        await notificationModel.insertMany(notifications);

        await sendNotificationEmails(
            user.email,
            user.fullName,
            email,
            fullName
        );
        return res.status(201).json({
            message: "Admin created successfully, notifications sent.",
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

//get user
export const viewSingleUser = async (req, res) => {
    try {
        // const user = req.user
        return res.status(200).json({ payload: req.user });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const viewAllUsers = async (req, res) => {
    try {
        const users = await entity.getAllFilteredData(userModel, {});
        return res.status(200).json({ payload: users });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
//delete User
export const deleteUser = async (req, res) => {
    try {
        const userId = req.userId;
        await entity.deleteDataById(userId, userModel);
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
            await entity.updateDataById(userId, payload, userModel);
            return res.status(200).json({
                message: "user suspended successfully",
            });
        }
        const payload = {
            status: UserStatus.ACTIVE,
        };
        await entity.updateDataById(userId, payload, userModel);
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
        const checkFields = entity.checkMissingFieldsInput(
            updateField,
            req.body
        );
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
        await entity.updateDataById(user._id, payload, userModel);
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
        const encrypedToken = encryptData(token, process.env.ENCRYPTION_KEY);
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
        const checkFields = entity.checkMissingFieldsInput(
            verifyOTPField,
            req.body
        );
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
            await entity
                .updateDataById(_doc._id, updateData, userModel)
                .then(() => {
                    const emailMessage = {
                        recieverEmail: email,
                        subject: "Account verification successful",
                        text: `Hello ${_doc.fullName}. ${messages.VERIFIED_OTP}`,
                    };
                    const payload = {
                        id: _doc._id,
                        role: _doc.role,
                    };
                    const token = entity.jwtSign(payload);
                    res.setHeader("Authorization", `Bearer ${token}`);
                    sendEmail(emailMessage);
                    return res.status(200).json({
                        message: "OTP verification successful",
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
