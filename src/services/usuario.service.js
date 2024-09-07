import UsuarioRepository from "../repositories/usuario.repository.js";

async function createUsuario(usuario) {
  return await UsuarioRepository.createUsuario(usuario);
}

async function getUsuarios() {
  return await UsuarioRepository.getUsuarios();
}

async function getUsuario(id) {
  return await UsuarioRepository.getUsuario(id);
}

async function getUsuarioAuth(info) {
  return await UsuarioRepository.getUsuarioAuth(info);
}

async function deleteUsuario(id) {
  return await UsuarioRepository.deleteUsuario(id);
}

async function updateUsuario(usuario) {
  return await UsuarioRepository.updateUsuario(usuario);
}

export default {
  createUsuario,
  getUsuarios,
  getUsuario,
  getUsuarioAuth,
  deleteUsuario,
  updateUsuario,
};
