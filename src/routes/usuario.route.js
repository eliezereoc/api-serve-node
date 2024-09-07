import express from "express";
import UsuarioController from "../controllers/usuario.controller.js";
import genericoService from "../services/generico.service.js";

const router = express.Router();

router.post("/", genericoService.auth, UsuarioController.createUsuario);
router.get("/", genericoService.auth, UsuarioController.getUsuarios);
router.get("/nome", genericoService.auth, UsuarioController.getUsuarioAuth);
router.get("/:id", genericoService.auth, UsuarioController.getUsuario);
router.delete("/:id", genericoService.auth, UsuarioController.deleteUsuario);
router.put("/", genericoService.auth, UsuarioController.updateUsuario);


export default router;
