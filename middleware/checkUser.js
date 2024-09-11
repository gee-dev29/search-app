import { userModel } from "../interface/userModel.js";
import jwt from "jsonwebtoken";

export const checkUser = async (req, res, next) => {
    try {
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1]; // Extract the token
        }
        if (!token) {
            return res
                .status(401)
                .json({ message: "No token provided, authorization denied" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId.id;
        const user = await userModel.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user;
        req.userId = userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token is invalid or expired" });
    }
};
