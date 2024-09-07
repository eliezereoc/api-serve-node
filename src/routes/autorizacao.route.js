import express from "express";
import autorizacaoController from "../controllers/autorizacao.controller.js";

const router = express.Router();
router.post("/", autorizacaoController.verificaUsuario);

export default router;
