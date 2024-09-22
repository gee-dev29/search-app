import express from "express";
import { checkUser } from "../middleware/checkUser.js";
import { superAdminRoleCheck } from "../middleware/checkRole.js";
import { jwtVerify } from "../middleware/jwtAuthentification.js";
import { deleteUser, viewAllUsers, viewSingleUser } from "../controller/userController.js";
const router = express.Router();
router
    .route("/:role?")
    .get(jwtVerify, superAdminRoleCheck, viewAllUsers);

router
    .route("/:id")
    .get(jwtVerify, checkUser, viewSingleUser)
    .delete(jwtVerify, superAdminRoleCheck, deleteUser);

export default router;
