import express from "express";
import { jwtVerify } from "../middleware/jwtAuthentification.js";
import { checkUser } from "../middleware/checkUser.js";
import { getApporvalData } from "../controller/approvalController.js";
const router = express.Router();

router.route("/").get(jwtVerify, checkUser, getApporvalData);

export default router;
