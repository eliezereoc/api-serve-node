// Conexões com o banco de dados
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import winston from "winston";
import dotenv from "dotenv/config";
import setupSwagger from './swagger.js';
import usuarioRoutes from "./src/routes/usuario.route.js";
import autorizacaoRoutes from "./src/routes/autorizacao.route.js";
import db from "./src/repositories/db.js";

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
      datePattern: 'YYYY-MM-DD',  // Padrão da data no nome do arquivo
      zippedArchive: true,        // Compacta os arquivos antigos
      maxSize: '20m',             // Tamanho máximo por arquivo
    }),
  ],
  format: combine(
    label({ label: process.env.LOG_NAME }),
    timestamp(),
    myFormat
  ),
});

const __dirname = path.resolve();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite de 100 solicitações por janela
});

const app = express();
setupSwagger(app);

// Configura o tamanho máximo da solicitação para 10 MB
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use(express.json());
app.use(cors());
//app.get("/", (req, res) => res.status(200).send(`Para documentação acesse http://localhost:3000/api-docs`));
app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "src", "views", "home.html");
  res.sendFile(filePath);
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
