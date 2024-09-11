import mongoose from "mongoose";
import { UserStatus } from "../enums/statusEnum.js";
import { Role } from "../enums/role.js";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
        },
        address: {
            street: {
                type: String,
            },
            city: {
                type: String,
            },
            state: {
                type: String,
            },
            country: {
                type: String,
            },
            postalCode: {
                type: String,
            }
        },
        profilePicture: {
            type: String,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        otp: {
            otp: {
                type: String,
                required: true,
            },
            expiresIn: {
                type: Date,
                required: true,
            },
        },
        role: {
            type: String,
            enums: [, Role.ADMIN, Role.SUPER_ADMIN, Role.USER],
            default: Role.USER,
        },
        UserStatus: {
            type: String,
            enum: [UserStatus.ACTIVE, UserStatus.SUSPENDED, UserStatus.DELETED],
            default: UserStatus.ACTIVE,
        },
        isSuspended: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export const userModel = mongoose.model("user", userSchema);
