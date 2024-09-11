import { userModel } from "../interface/userModel.js";

export const checkUser = async (req, res, next) => {
    // Check if user ID exists in params or body
    let userId;
    if (req.params && req.params.id) {
        userId = req.params.id;
    } else if (req.body && req.body.id) {
        userId = req.body.id;
    }

    // Handle missing user ID
    if (!userId) {
        return res.status(400).json({ message: "User Id is required" });
    }

    // Find the user using userModel
    const user = await userModel.findById({ _id: userId }).select("-password");

    // Handle user not found
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Assign user to request object

    req.userId = userId;
    req.user = user;
    next();
};
