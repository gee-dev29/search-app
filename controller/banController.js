import { bannedIpModel } from "../interface/bannedIPs.js";
import { getAllFilteredData } from "../utils/entity.js";

export const banIPAddress = async (req, res) => {
    try {
        const ip = req.ip;
        const bannedIp = await getAllFilteredData(bannedIpModel, {
            ipAddress: ip,
        });
        if (bannedIp) {
            return res.status(403).json({
                message: `Your IP ${ip} has been banned due to excessive requests.`,
            });
        }
        const existingOffense = await bannedIpModel.findOneAndUpdate(
            { ipAddress: ip },
            { $inc: { offenseCount: 1 } },
            { new: true, upsert: true }
        );

        if (existingOffense.offenseCount >= maxOffenses) {
            await bannedIpModel.updateOne(
                { ipAddress: ip },
                {
                    reason: "Exceeded rate limit",
                    bannedAt: Date.now(),
                    offenseCount: existingOffense.offenseCount,
                }
            );

            return res.status(403).json({
                message: `Your IP ${ip} has been banned due to excessive requests`,
            });
        }
        res.status(429).json({
            message: "Too many requests, please try again in 15 minutes.",
        });
    } catch (error) {
        console.error("Error processing rate limit:", error);
        return res.status(500).json({
            message: error.message,
        });
    }
};
