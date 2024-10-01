import express from "express";
import { getAllCountries } from "../controller/countryController.js";

const router = express.Router();


router.route("/").get(getAllCountries);
router.route

export default router;