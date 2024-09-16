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

    if (result.status == 'erro') {
      logger.warn(`DELETE /usuario - Usuário com ID ${id} não encontrado.`);
      return { status: "erro", message: `Usuário com ID ${id} não encontrado.` };
    }

    logger.info(`DELETE /usuario - Usuário com ID ${id} foi excluído com sucesso.`);
    return { status: "sucesso", message: `DELETE /usuario - Usuário com ID ${id} foi excluído com sucesso.` };
    
  } catch (error) {
    logger.error(`DELETE /usuario - Erro ao excluir usuário: ${error.message}`);
    return { status: "erro", code: 500, message: 'Erro ao excluir usuário.' };
  }

  
}

async function updateUsuario(usuario) {
  try {
    const result = await UsuarioRepository.updateUsuario(usuario);
  
    if (result.status === 'erro') {
      logger.warn(`PUT /usuario - Usuário  não encontrado.`);
      return { status: `erro`, message: `Usuário  não encontrado.` };
    }

    logger.info(`PUT /usuario - Usuário com e-mail ${usuario.email} foi alterado com sucesso.`);
    return { status: "sucesso", message: `Usuário foi alterado com sucesso.` };
    
  } catch (error) {
    logger.error(`PUT /usuario - Erro ao alterar usuário - ${error.message}`);
    return { status: "erro", code: 500, message: 'Erro ao alterar usuário.' };
  }
}

export default {
  createUsuario,
  getUsuarios,
  getUsuario,
  getUsuarioAuth,
  deleteUsuario,
  updateUsuario,
};
