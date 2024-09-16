import { userModel } from "../interface/userModel.js";
import { entity } from "../utils/entity.js";

export const findUserByEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        const checkFields = entity.checkMissingFieldsInput(["email"], req.body);
        if (!checkFields.result) {
            return res.status(400).json({
                message: checkFields.message,
            });
        }

        const user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: "user not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
