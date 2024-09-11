// import {
//     deleteUser,
//     viewAllUsers,
//     viewSingleUser,
// } from "../controllers/userController.js";
import express from "express";
// import { checkUser } from "../middleware/checkUser.js";
// import { jwtVerify } from "../middleware/jwtAuthentication.js";
// import { superAdminRoleCheck } from "../middleware/checkRole.js";
// import { checkProduct } from "../middleware/checkProduct.js";
const router = express.Router();
// router
//     .route("/")
//     .get(jwtVerify, checkUser, viewSingleUser)
//     .get(jwtVerify, superAdminRoleCheck, viewAllUsers);

// router
//     .route("/:id")
//     .get(jwtVerify, checkUser, viewSingleUser)
//     .delete(jwtVerify, superAdminRoleCheck, deleteUser);
    
// router
//     .route("/:productId")
//     .patch(jwtVerify, checkUser, checkProduct, superAdminRoleCheck)

export default router;
