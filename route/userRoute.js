import express from "express";
import { checkUser } from "../middleware/checkUser.js";
import { superAdminRoleCheck } from "../middleware/checkRole.js";
import { jwtVerify } from "../middleware/jwtAuthentification.js";
import {
  deleteAdmin,
  toggleSuspendUser,
  updateUserProfile,
  viewAllUsers,
  viewSingleUser,
} from "../controller/userController.js";
const router = express.Router();
router
  .route("/:role")
  .get(jwtVerify, checkUser, superAdminRoleCheck, viewAllUsers);

router
  .route("/")
  .get(jwtVerify, checkUser, viewSingleUser)
  .delete(jwtVerify, checkUser, superAdminRoleCheck, deleteAdmin);
router
  .route("/toggle-status")
  .patch(jwtVerify, checkUser, superAdminRoleCheck, toggleSuspendUser)

router.route("/update-profile").put(jwtVerify, checkUser, updateUserProfile);
export default router;
