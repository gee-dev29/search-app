import express from "express";
import { checkUser } from "../middleware/checkUser.js";
import { superAdminRoleCheck } from "../middleware/checkRole.js";
import { jwtVerify } from "../middleware/jwtAuthentication.js";
import {
  deleteAdmin,
  deleteUser,
  getAllLogs,
  toggleSuspendUser,
  updateUserPermissions,
  updateUserProfile,
  viewAllUsers,
  viewSingleUser,
} from "../controller/userController.js";
import { checkPermission } from "../middleware/checkPermission.js";
import { Permissions } from "../enums/permissions.js";
const router = express.Router();
router
  .route("/:role")
  .get(jwtVerify, checkUser, superAdminRoleCheck, checkPermission(Permissions.VIEW_USERS), viewAllUsers);

router
  .route("/")
  .get(jwtVerify, checkUser, viewSingleUser)
  .delete(jwtVerify, checkUser, checkPermission(Permissions.DELETE_USERS), superAdminRoleCheck, deleteAdmin);
router
  .route("/toggle-status")
  .patch(jwtVerify, checkUser, superAdminRoleCheck, toggleSuspendUser);

router.put(
  "/assign-permissions",
  jwtVerify,
  checkUser,
  checkPermission(Permissions.MANAGE_ROLE),
  superAdminRoleCheck,
  updateUserPermissions
);

router
.route("/logs/activity")
.get(jwtVerify, checkUser, superAdminRoleCheck, getAllLogs);

router.route("/update-profile").put(jwtVerify, checkUser, updateUserProfile);
router.delete(
  "/:id",
  jwtVerify,
  checkUser,
  checkPermission(Permissions.DELETE_USERS),
  superAdminRoleCheck,
  deleteUser
);
export default router;
