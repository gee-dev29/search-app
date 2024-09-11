import { userModel } from "../interface/userModel.js";
import jwt from "jsonwebtoken";

export const checkUser = async (req, res, next) => {
    try {
        let token;
        let userId;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            userId = req.params.id || req.body.id;
        } else {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.userId.id;
        }

        if (!userId) {
            return res.status(401).json({
                message: "No token or userId provided, authorization denied",
            });
        }
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
