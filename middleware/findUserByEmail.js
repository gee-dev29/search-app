import { UserStatus } from "../enums/statusEnum.js";
import { userModel } from "../interface/userModel.js";
import {
    checkMissingFieldsInput,
} from "../utils/entity.js";

export const findUserByEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        const checkFields = checkMissingFieldsInput(["email"], req.body);
        if (!checkFields.result) {
            return res.status(400).json({
                message: checkFields.message,
            });
        }
        const modifiedEmail = email.toLowerCase()
        const user = await userModel.findOne({ email: modifiedEmail });
        if (!user) {
            return res.status(400).json({ message: "user not found" });
        }
        if(user.UserStatus == UserStatus.SUSPENDED){
            return res.status(401).json({ message: "Your account has been suspended. contact admin" });
        }
        const { otp, ...others} = user._doc
        req.user = others;
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
