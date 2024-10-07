import { UserStatus } from "../enums/statusEnum.js";
import { userModel } from "../interface/userModel.js";

export const checkUser = async (req, res, next) => {
    try {
        const userId = req.id;
        
        const user = await userModel.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if(user.UserStatus == UserStatus.SUSPENDED){
            return res.status(401).json({ message: "Your account has been suspended. contact admin" });
        }
        
        req.user = user;
        req.userId = userId
        req.role = user.role
        next();
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
};
