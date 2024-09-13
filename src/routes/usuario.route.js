import express from "express";
import UsuarioController from "../controllers/usuario.controller.js";
import genericoService from "../services/auth.service.js";

const router = express.Router();

router.post("/", genericoService.auth, UsuarioController.createUsuario);

/**
 * @swagger
 * /api/v1/usuario:
 *   get:
 *     summary: Retorna todos os usuários
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema: { type: array, items: { type: object, properties: { id: { type: integer, example: 1 }, nome: { type: string, example: "João" }, email: { type: string, example: "joao@joao.com" }, data_criacao: { type: string, format: date-time, example: "2024-09-12T03:00:00Z" }, data_alteracao: { type: string, format: date-time, example: "2024-09-12T03:00:00Z" } } } }
 *       404: { description: Não há usuários cadastrados }
 *       401: { description: Não autorizado }
 *       500: { description: Erro interno do servidor }
 */
router.get("/", genericoService.auth, UsuarioController.getUsuarios);

router.get("/nome", genericoService.auth, UsuarioController.getUsuarioAuth);

/**
 * @swagger
 * /api/v1/usuario/{id}:
 *   get:
 *     summary: Retorna um usuário pelo ID
 *     tags: [Usuários]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema: { type: object, properties: { id: { type: integer, example: 1 }, nome: { type: string, example: "João" }, email: { type: string, example: "joao@joao.com" }, data_criacao: { type: string, format: date-time, example: "2024-09-12T03:00:00Z" }, data_alteracao: { type: string, format: date-time, example: "2024-09-12T03:00:00Z" } } }
 *       401: { description: Não autorizado }
 *       404: { description: Usuário não encontrado }
 *       500: { description: Erro interno do servidor }
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.get("/:id", genericoService.auth, UsuarioController.getUsuario);
router.delete("/:id", genericoService.auth, UsuarioController.deleteUsuario);
router.put("/", genericoService.auth, UsuarioController.updateUsuario);

export default router;

