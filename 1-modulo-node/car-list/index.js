import express from "express";
import winston from "winston";

import marcasRouter from "./routes/marcasRouter.js";

global.fileName = "car-list.json";

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});
global.logger = winston.createLogger({
    level: "silly",
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "./logs/api-marcas.log" }),
    ],
    format: combine(label({ label: "api-marcas" }), timestamp(), myFormat)
});

const app = express();
app.use(express.json());
app.use("/marcas", marcasRouter);

app.listen(3000, () => {
    logger.info("Api Started!");
});
