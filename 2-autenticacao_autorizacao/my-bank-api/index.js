import express from "express";
import { promises as fs } from "fs";
import winston from "winston";
import { graphqlHTTP } from 'express-graphql';
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./doc.js"
import basicAuth from "express-basic-auth";

import Schema from './schema/index.js';
import accountsRouter from "./routes/account.routes.js";

const { readFile, writeFile } = fs;

global.fileName = "accounts.json";

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});
global.logger = winston.createLogger({
  level: "silly",
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "my-bank-api.log" }),
  ],
  format: combine(label({ label: "my-bank-api" }), timestamp(), myFormat),
});

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(basicAuth({
  authorizer: (username, password) => {
    // aqui deve-se fazer uma requisição com banco de dados para validar o usuario e senha.
    const usuAdmin = basicAuth.safeCompare(username, 'admin');
    const pwdAdmin = basicAuth.safeCompare(password, 'admin');

    const usuNormal = basicAuth.safeCompare(username, 'silva');
    const pwdNormal = basicAuth.safeCompare(password, '1234');

    return usuAdmin && pwdAdmin || usuNormal && pwdNormal;
  }
}));

app.use("/account", authorize('administrador', 'usuarionormal'), accountsRouter);

app.use("/graphql", graphqlHTTP({
  schema: Schema,
  graphiql: true
}));

app.listen(3000, async () => {
  try {
    await readFile(fileName);
    logger.info("Api Started!");
  } catch (err) {
    const initialJson = {
      nextId: 1,
      accounts: [],
    };
    writeFile(fileName, JSON.stringify(initialJson))
      .then(() => {
        logger.info("Api Started and File Created!");
      })
      .catch((err) => {
        logger.error(err);
      });
  }
});

function getRole(username) {
  // aqui deve-se fazer uma requisição com banco de dados para validar as roles.
  if (username == 'admin') {
    return 'administrador';
  } else if (username == 'silva') {
    return 'usuarionormal';
  }
}

function authorize(...allowed) {
  const isAllowed = role => allowed.indexOf(role) > -1;
  return (req, res, next) => {
    if (req.auth.user) {
      const role = getRole(req.auth.user)
      if (isAllowed(role)) {
        next();
      } else {
        res.status(403).send('Forbidden');
      }
    } else {
      res.status(401).send('Unauthorized');
    }
  };
}