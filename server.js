import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import consola from "consola";
import dotenv from "dotenv";
import authRoute from "./route/authRoute.js";
import userRoute from "./route/userRoute.js";
import dataEntryRoute from "./route/dataEntryRoute.js";
import dbConnection from "./connection/dbConnection.js";
// import { swaggerApi } from "./swaggerDoc.js";

const app = express();

// const options = {
//     swaggerOptions
// }

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

// combineRoute();
dbConnection();

// swaggerApi(app)

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/data-entry", dataEntryRoute);
app.listen(process.env.PORT || 8920, () => {
    consola.success({
        message: `Server started on port ${process.env.PORT || 8920}`,
        badge: true,
    });
});
