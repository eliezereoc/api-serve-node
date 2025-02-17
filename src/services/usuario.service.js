import UsuarioRepository from "../repositories/usuario.repository.js";
import bcrypt from "bcrypt";

async function createUsuario(usuario) {
  const [emailExiste] = await UsuarioRepository.getUsuarioByEmail(usuario.email);
  const [usuarioExiste] = await UsuarioRepository.getUsuarioByUsuario(usuario.usuario);

  const usuarioInativo = (user) => user?.active === 'N';// Verifica se o usuário está inativo

  if (emailExiste?.email && emailExiste.active === 'S'){// Verifica se o e-mail já existe     
    logger.error(`E-mail ${emailExiste?.email } já cadastrado.`);
    return { status: "erro", code: 409, message: `E-mail já está em usu.` };
  }

  if (usuarioExiste?.usuario && usuarioExiste.active === 'S'){// Verifica se o usuário já existe
    logger.error(`Usuário ${usuarioExiste.usuario} já cadastrado.`);
    return { status: "erro", code: 409, message: `Usuário já está em usu.` };
  }

  // Decodifica a senha e cria o hash
  const senhaDecodificada = Buffer.from(usuario.senha, "base64").toString("utf-8");
  const senhaHash = await bcrypt.hash(senhaDecodificada, 10);
  usuario.senha = senhaHash;

  // Verifica se o email ou o usuário existem, mas estão inativos
  if (usuarioInativo(emailExiste) || usuarioInativo(usuarioExiste)) {     
    usuario.active = 'S';// Adiciona o campo active antes de criar o usuário   

    const result = await UsuarioRepository.updateUsuario(usuario, "N");
    if (result.status === 'erro') {
      logger.warn(`PUT /usuario - Usuário  não encontrado.`);
      return { status: `erro`, message: `Usuario não encontrado ou inativo.` };
    }
 
    if (result.status === 'null') {
      logger.warn(`PUT /usuario - Nenhum registro foi atualizado.`);
      return { status: `erro`, message: `Nenhum registro foi atualizado.` };
    } 
    
    logger.info(`PUT /usuario - O Usuário ${usuario.usuario} foi reativado com sucesso.`);
    return { status: "sucesso", code: 200, message: `Usuário cadastrado com sucesso!` };
  }

  const result = await UsuarioRepository.createUsuario(usuario);

  if (result.status === 'sucesso') {
    return { status: "sucesso", code: 200, message: `Usuário cadastrado com sucesso!` };
  }

  if (result.status === 'erro') {
    return { status: "erro", code: 500, message: `Erro ao inserir o registro!` };
  }
}

async function getUsuarios() {
  return await UsuarioRepository.getUsuarios();
}

async function getUsuario(id) {
  return await UsuarioRepository.getUsuario(id);
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
      return { status: "erro", code: 404, message: `Usuário com ID ${id} não encontrado.` };
    }

    logger.info(`DELETE /usuario - Usuário com ID ${id} foi excluído com sucesso.`);
    return { status: "sucesso", message: `Usuário excluído com sucesso.` };
    
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
      return { status: `erro`, message: `Usuario não encontrado ou inativo.` };
    }
 
    if (result.status === 'null') {
      logger.warn(`PUT /usuario - Nenhum registro foi atualizado.`);
      return { status: `erro`, message: `Nenhum registro foi atualizado.` };
    } 
    
    logger.info(`PUT /usuario - O Usuário ${usuario.usuario} foi alterado com sucesso.`);
    return { status: "sucesso", message: `Usuário foi alterado com sucesso.` };
    
  } catch (error) {
    console.log(error);
    
    logger.error(`PUT /usuario - Erro ao alterar usuário - Mensagem: ${error.message} - Erro: ${error.error}`);
    return { status: "erro", code: error.status, message: `Erro ao alterar usuário.` };
  }
}
 
export default {
  createUsuario,
  getUsuarios,
  getUsuario, 
  deleteUsuario,
  updateUsuario  
};
