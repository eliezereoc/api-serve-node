import autorizacaoSevice from "../services/autorizacao.service.js";
import AuthController from "../services/auth.service.js";

async function verificaUsuario(req, res, next) {
  try {  
    if (req.body.usuario === undefined || req.body.senha === undefined)
      return res.status(400).send({ message: "Campos usuário e senha são obrigatorios!" });

    const usuario = { usuario: req.body.usuario, senha: req.body.senha };        
    const verifica = await autorizacaoSevice.getUsuarioAuth(usuario);

    if (verifica.status === "erro") return res.status(401).send(verifica);
 
    const token = await AuthController.criarToken(verifica.usuario);

    if (token !== "" && token !== undefined) {
      logger.info(`Token gerado com sucesso para o usuário ${usuario.usuario}`);
      return res.status(200).send({ access_token: token });
    }

    return res.status(401).send({ message: "Falha na autenticação: token não encontrado"});
  } catch (error) {
    logger.error(
      `${process.env.APP_NAME} - Erro - ${error}`
    );
    return res.status(500).send({ message: `${error}`});
  }
}

export default {
  verificaUsuario,
};
