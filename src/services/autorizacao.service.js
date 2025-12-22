import autorizacaoRepository from "../repositories/autorizacao.repository.js";
import bcrypt from "bcrypt";
 
async function getUsuarioAuth(usuario) {
  const result = await autorizacaoRepository.getUsuarioAuth(usuario);
    
  if (result.status === "erro") {
    logger.warn(`Auth usuario - Usuário  ou senha inválidos.`);
    return { status: `erro`, code: 401, message: `Usuário  ou senha inválidos.` };
  }
    
  const senhaDecodificada = Buffer.from(usuario.senha, "base64").toString("utf-8");
  const senhaCorreta = await bcrypt.compare(senhaDecodificada, result.senha);

  if (!senhaCorreta) {
    logger.warn(`Auth usuario - Usuário  ou senha inválidos.`);
    return { status: `erro`, code: 401, message: `Usuário  ou senha inválidos.` };
  }
     
  return { status: `ok`, usuario: result };  
}

export default {  
  getUsuarioAuth,
};
