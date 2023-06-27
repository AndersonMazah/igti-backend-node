import express from "express";
import winston from "winston";

import pedidosRouter from "./routes/pedidos.routes.js";

global.fileName = "pedidos.json";

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});
global.logger = winston.createLogger({
    level: "silly",
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "./logs/api-pedidos.log" }),
    ],
    format: combine(label({ label: "api-pedidos" }), timestamp(), myFormat)
});

const app = express();
app.use(express.json());
app.use("/pedidos", pedidosRouter);

app.listen(3000, () => {
    logger.info("Api Started!");
});
