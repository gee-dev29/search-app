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
        profilePicture: {
            type: String,
        },
        UserStatus: {
            type: String,
            enums: [
                ,
                UserStatus.ACTIVE,
                UserStatus.DELETED,
            ],
            default: UserStatus.ACTIVE,
        },
        role: {
            type: String,
            enums: [, Role.ADMIN, Role.SUPER_ADMIN],
            default: Role.ADMIN,
        },
        isSuspended: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export const userModel = mongoose.model("user", userSchema);
