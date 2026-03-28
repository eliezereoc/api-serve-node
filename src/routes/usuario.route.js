import express from "express";
import UsuarioController from "../controllers/usuario.controller.js";
import AuthController from "../services/auth.service.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/usuario:
 *   post:
 *     summary: Cria um novo usuario
 *     tags: [Usuarios]
 *     description: A senha deve ser enviada em Base64.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@johndoe.com
 *               senha:
 *                 type: string
 *                 description: Senha em Base64
 *                 example: YWRtaW4=
 *               usuario:
 *                 type: string
 *                 example: john.doe
 *     responses:
 *       200:
 *         description: Usuario criado com sucesso
 *       401:
 *         description: Nao autorizado
 *       409:
 *         description: Conflict - Usuario ja cadastrado
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/", AuthController.auth, UsuarioController.createUsuario);

/**
 * @swagger
 * /api/v1/usuario:
 *   get:
 *     summary: Retorna todos os usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       404:
 *         description: Nao ha usuarios cadastrados
 *       401:
 *         description: Nao autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/", AuthController.auth, UsuarioController.getUsuarios);

/**
 * @swagger
 * /api/v1/usuario/{id}:
 *   get:
 *     summary: Retorna um usuario pelo ID
 *     tags: [Usuarios]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       401:
 *         description: Nao autorizado
 *       404:
 *         description: Usuario nao encontrado
 *       500:
 *         description: Erro interno do servidor
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.get("/:id", AuthController.auth, UsuarioController.getUsuario);

/**
 * @swagger
 * /api/v1/usuario/{id}:
 *   delete:
 *     summary: Deleta um usuario pelo ID
 *     tags: [Usuarios]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario deletado com sucesso
 *       401:
 *         description: Nao autorizado
 *       404:
 *         description: Usuario nao encontrado
 *       500:
 *         description: Erro interno do servidor
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.delete("/:id", AuthController.auth, UsuarioController.deleteUsuario);

/**
 * @swagger
 * /api/v1/usuario:
 *   put:
 *     summary: Atualiza as informacoes de um usuario
 *     tags: [Usuarios]
 *     description: Quando informada, a senha deve ser enviada em Base64.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario:
 *                 type: string
 *                 example: john.doe
 *               nome:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@johndoe.com
 *               senha:
 *                 type: string
 *                 description: Senha em Base64
 *                 example: bm92YVNlbmhhMTIz
 *               active:
 *                 type: string
 *                 enum: [S, N]
 *                 example: S
 *             required:
 *               - nome
 *               - email
 *               - active
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario atualizado com sucesso
 *       400:
 *         description: Requisicao invalida. Verifique os campos obrigatorios.
 *       401:
 *         description: Nao autorizado
 *       404:
 *         description: Usuario nao encontrado
 *       500:
 *         description: Erro interno do servidor
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.put("/", AuthController.auth, UsuarioController.updateUsuario);

export default router;
