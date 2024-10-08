import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import consola from "consola";
import dotenv from "dotenv";
import authRoute from "./route/authRoute.js";
import userRoute from "./route/userRoute.js";
import dataEntryRoute from "./route/dataEntryRoute.js";
import searchRoute from "./route/searchRoute.js";
import countriesRoute from "./route/countryRoute.js";
import dbConnection from "./connection/dbConnection.js";

const app = express();

dotenv.config();

// middleware
app.use(cors());
app.use(
    bodyParser.urlencoded({
        limit: "50mb",
        extended: true,
        parameterLimit: 50000,
    })
);

app.use(bodyParser.json({ limit: "50mb" }));

dbConnection();

// app.use(rateLimitterMiddleware)
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/data", dataEntryRoute);
app.use("/api/v1/search", searchRoute);
app.use("/api/v1/countries", countriesRoute);

app.listen(process.env.PORT || 8080, () => {
    consola.success({
        message: `Server started on port ${process.env.PORT || 8080}`,
        badge: true,
    });
});