import resetPasswordTemplate from "../emailService/template/template.js";
import { sendEmail } from "../emailService/email.js";
import { messages } from "../message/messageEnum.js";

import dotenv from "dotenv";
dotenv.config();
import {
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
  checkMissingFieldsInput,
  updateDataById,
  deleteDataById,
  encryptData,
  getSingleData,
} from "../utils/entity.js";
import { userModel } from "../interface/userModel.js";
import { UserStatus } from "../enums/statusEnum.js";
import { logActivity } from "../utils/ActivityLogger.js";
import { ActivityLogType } from "../enums/ActivityLogType.js";
import { ActivityLog } from "../models/ActivityLog.js";

export const registerAdmin = async (req, res) => {
  try {
    const { fullName, phone, email, password, role, _id } = req.body;

    // Check for missing fields
    const checkFields = checkMissingFieldsInput(registerField, req.body);
    if (!checkFields.result) {
      return res.status(400).json({
        message: checkFields.message,
      });
    }

    // Hash the password first
    const hashPassword = await encryptPassword(password);

    // If _id is provided, we're updating an existing user
    if (_id) {
      // Prepare the update data, excluding _id and password
      const updateData = {
        ...req.body,
        password: hashPassword, // Update the password with the hashed value
        email: email.toLowerCase(), // Normalize email to lowercase
      };

      // Update the user in the database
      const user = await userModel.findOneAndUpdate({ _id }, updateData);

      // Check if the user was found and updated
      if (!user) {
        return res.status(404).json({
          message: "Admin not found or no changes made",
        });
      }
      await logActivity({
        by: req.user,
        description: user.fullName + " " + "Updated admin details",
        eventType: ActivityLogType.Create,
        properties: updateData,
        on: user,
      });

      return res.status(200).json({
        message: "Admin updated successfully",
      });
    }

    // If no _id is provided, we're creating a new user
    const newUser = new userModel({
      fullName,
      email: email.toLowerCase(),
      password: hashPassword,
      phone,
      role,
    });

    await newUser.save();
    await logActivity({
      by: req.user,
      description: user.fullName + " " + "Created a new user",
      eventType: ActivityLogType.Create,
      properties: newUser,
      on: newUser,
    });
    return res.status(201).json({
      message: "Admin created successfully",
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
    await logActivity({
      by: user._id,
      description: user.fullName + " " + "Logged in",
      eventType: ActivityLogType.Create,
      properties: user,
      on: user,
    });

    return res.status(200).json({
      message: "Admin login successful",
      payload: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        phone: user?.phone,
        role: user.role,
        token: token,
      },
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
    const { id } = req.query;
    const data = await getSingleData(userModel, id);
    return res.status(200).json({ payload: data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//edit user
export const updateUserProfile = async (req, res) => {
  try {
    const id = req.userId;
    const { fullName, phone, password } = req.body;
    if (password) {
      const hashPassword = await encryptPassword(password);
      const payload = {
        password: hashPassword,
      };
      const data = await updateDataById(id, payload, userModel);
      await logActivity({
        by: req.user,
        description: user.fullName + " " + "Changed user password",
        eventType: ActivityLogType.Update,
        on: data ?? {},
      });
      const newPayload = {
        fullName: data?.fullName,
        email: data?.email,
        role: data?.role,
        phone: data?.phone,
      };
      return res.status(200).json({
        message: "password updated successfully",
        payload: newPayload,
      });
    }
    const payload = {
      fullName: fullName,
      phone: phone,
    };
    const data = await updateDataById(id, payload, userModel);
    await logActivity({
      by: req.user,
      description: user.fullName + " " + "Updated user's profile",
      eventType: ActivityLogType.Update,
      properties: payload,
      on: data ?? {},
    });
    const newPayload = {
      fullName: data?.fullName,
      email: data?.email,
      role: data?.role,
      phone: data?.phone,
    };
    return res
      .status(200)
      .json({ message: "profile updated successfully", payload: newPayload });
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

// view all admin
export const viewAllUsers = async (req, res) => {
  try {
    const role = req.params.role;
    let filter;
    if (role == "all") {
      filter = {};
    } else {
      filter = {
        role: role,
      };
    }
    const users = await userModel.find(filter).select("-password");
    return res.status(200).json({ payload: users });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//delete Admin
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.body;
    await deleteDataById(id, userModel);
    await logActivity({
      by: req.user,
      description: user.fullName + " " + "User Deleted",
      eventType: ActivityLogType.Create,
      properties: {},
      on: {},
    });
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {}
};

//suspend a user
export const toggleSuspendUser = async (req, res) => {
  try {
    const { id } = req.query;
    const user = await getAllFilteredData(userModel, { _id: id });
    if (user[0].UserStatus == UserStatus.ACTIVE) {
      const payload = {
        UserStatus: UserStatus.SUSPENDED,
        isSuspended: true,
      };
      await updateDataById(id, payload, userModel);
      return res.status(200).json({
        message: "User suspended successfully",
      });
    }
    const payload = {
      UserStatus: UserStatus.ACTIVE,
      isSuspended: false,
    };
    await updateDataById(id, payload, userModel);
    return res.status(200).json({
      message: "User activated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//update Admin
export const updateAdmin = async (req, res) => {
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
      message: "Admin updated successfully",
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

export const getAllLogs = async (req, res) => {
  try {
    const result = ActivityLog.find();

    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
