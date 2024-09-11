import { userModel } from "../interface/userModel.js";
import jwt from "jsonwebtoken";

export const checkUser = async (req, res, next) => {
    try {
        const userId = req.id;
        const user = await userModel.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token is invalid or expired" });
    }
};
