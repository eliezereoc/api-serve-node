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

async function deleteUsuario(id, authenticatedUserId) {

  if (id == authenticatedUserId) {
    logger.warn(`DELETE /usuario - Você não pode excluir sua própria conta.`);
    return { status: "erro", code: 403, message: 'Você não pode excluir sua própria conta.' };
  }

  try {
    const result = await UsuarioRepository.deleteUsuario(id);

    if (result.affectedRows === 0) {
      logger.warn(`DELETE /usuario - Usuário com ID ${id} não encontrado.`);
      return { status: "erro", code: 404, message: 'Usuário não encontrado.' };
    }

    return { status: "sucesso", message: 'Usuário excluído com sucesso.' };
    
  } catch (error) {
    logger.error(`DELETE /usuario - Erro ao excluir usuário: ${error.message}`);
    return { status: "erro", code: 500, message: 'Erro ao excluir usuário.' };
  }

  
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
