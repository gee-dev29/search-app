import { bannedIpModel } from "../interface/bannedIPModel.js";
import { getAllFilteredData } from "../utils/entity.js";

// / Middleware to check if the IP is banned
export const checkBannedIP = async (req, res, next) => {
    try {
        const ip = getNormalizedIp(req);
        const bannedIp = await getAllFilteredData(bannedIpModel, {
            ipAddress: ip,
        });

        if (bannedIp) {
            return res.status(403).json({
                message: `Your IP ${ip} has been banned from accessing this resource.`,
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
