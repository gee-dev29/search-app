import { bannedIpModel } from "../interface/bannedIPModel.js";
import { getAllFilteredData } from "../utils/entity.js";

const maxOffenses = 3;

const getNormalizedIp = (req) => {
    const ip = req.ip;
    return ip.startsWith("::ffff:") ? ip.split(":").pop() : ip;
};

export const banIPAddress = async (req, res) => {
    try {
        const ip = getNormalizedIp(req);
        const bannedIp = await bannedIpModel.findOne({ ipAddress: ip });
        console.log(bannedIp);

        if (bannedIp) {
            return res.status(403).json({
                message: `Your IP ${ip} as been banned due to excessive requests.`,
            });
        }
        const existingOffense = await bannedIpModel.findOneAndUpdate(
            { ipAddress: ip },
            { $inc: { offenseCount: +1 } },
            { new: true, upsert: true, runValidators: true }
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
                message: `Your IP ${ip} as been banned due to excessive requests`,
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
