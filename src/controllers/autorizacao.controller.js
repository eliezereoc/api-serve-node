import usuarioService from "../services/usuario.service.js";
import genericoService from "../services/generico.service.js";
// import http from 'http';

async function verificaUsuario(req, res, next) {
  try {
    if (req.body.usuario === undefined || req.body.senha === undefined)
      return res.status(400).send({ message: "Informe usuário e senha!" });

    const usuario = { usuario: req.body.usuario, senha: req.body.senha };    
    const verifica = await usuarioService.getUsuarioAuth(usuario);

    if (verifica.status === "erro") return res.status(401).send(verifica);

    const token = await genericoService.criarToken(verifica.usuario);

    if (token !== "" && token !== undefined)
      return res.status(200).send({ access_token: token });

    return res.status(401).send({ message: "Falha na autenticação: token não encontrado"});
  } catch (error) {}
}

export default {
  verificaUsuario,
};
