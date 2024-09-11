import { Role } from "../enums/role.js";
const adminRoleCheck = async (req, res, next) => {
    try {
        const user = req.data;
        if (user.role !== Role.ADMIN) {
            return res.status(403).json({
                message: "Only an Admin can perform this action.",
            });
        }
        next();
    } catch (error) {
        next(err);
    }
};

const superAdminRoleCheck = async (req, res, next) => {
    try {
        const user = req.data;
        if (user.role !== Role.SUPER_ADMIN) {
            return res.status(403).json({
                message: "Only a Super Admin can perform this action.",
            });
        }
        next();
    } catch (error) {
        next(err);
    }
};

export { adminRoleCheck, superAdminRoleCheck };