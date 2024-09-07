import usuarioRepository from "../repositories/usuario.repository";

// aponta para busca de usuário.
async function getUsuario(usuario) {
  return await usuarioRepository.getUsuario(usuario);
}

export default {
  getUsuario,
};
