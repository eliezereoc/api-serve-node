import express from "express";
import autorizacaoController from "../controllers/autorizacao.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth:
 *   post:
 *     summary: Obter Token
 *     tags: [Auth]
 *     description: Verifica usuário e retorna um token de autorização.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario: { type: string, example: 'john.doe' }
 *               senha: { type: string, example: 'senha123' }
 *     responses:
 *       200:
 *         description: Token obtido com sucesso
 *         content:
 *           application/json:
 *             schema: { type: object, properties: { access_token: { type: string, example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' } } }
 *       400: { description: Solicitação inválida }
 *       401: { description: Não autorizado }
 *       500: { description: Erro interno do servidor }
 */
router.post("/", autorizacaoController.verificaUsuario);

export default router;
