import jwt from "jsonwebtoken";

export const jwtVerify = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                message: "User is not Authorized",
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(400).json({ message: "Invalid token" });
        }
        req.id = decoded.id;
        req.role = decoded.role;
        next();
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
