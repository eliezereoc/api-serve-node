// Conexões com o banco de dados
import db from "./src/repositories/db.js";

import express from "express";
import cors from "cors";
import winston from "winston";
import path from "path";
import usuarioRoutes from "./src/routes/usuario.route.js";
import autorizacaoRoutes from "./src/routes/autorizacao.route.js";
import bodyParser from "body-parser";
import dotenv from "dotenv/config";

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level} ${message}`;
});
global.logger = winston.createLogger({
  level: "silly",
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: process.env.DIR_FILE_LOG,
    }),
  ],
  format: combine(
    label({ label: process.env.LOG_NAME }),
    timestamp(),
    myFormat
  ),
});

const __dirname = path.resolve();

global.userLoggedId = "";

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limite de 100 solicitações por janela
// });

const app = express();

// Configura o tamanho máximo da solicitação para 10 MB
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("Conectado!");
});
app.use("/api/v1/usuario", usuarioRoutes);
app.use("/api/v1/auth", autorizacaoRoutes);



//Middleware de errors
app.use((err, req, res, next) => {
  logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
  res.status(400).send({ error: err.message });
});

app.listen(process.env.PORT_LISTEN, () => {
  logger.info(
    `${process.env.APP_NAME} iniciada com sucesso na porta ${process.env.PORT_LISTEN}!`
  );
});
