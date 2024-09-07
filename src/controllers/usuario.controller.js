import UsuarioService from "../services/usuario.service.js";

async function createUsuario(req, res, next) {
  try {
    let usuario = req.body;
    if (
      !usuario.nome ||
      !usuario.usuario ||
      !usuario.email ||
      !usuario.telefone ||
      !usuario.funcao ||
      !usuario.setor ||
      !usuario.senha ||
      !usuario.idnivel ||
      !usuario.foto
    ) {
      throw new Error("Todos os campos são obrigatórios!");
    }

    usuario = await UsuarioService.createUsuario(usuario);
    res.send(usuario);

    //logger.info(`POST /usuario - ${JSON.stringify(usuario)}`);
  } catch (err) {
    next(err);
  }
}

async function getUsuarios(req, res, next) {
  try {
    const usuario = await UsuarioService.getUsuarios();

    res.status(200).send(usuario);
    logger.info(`GET /usuarios - ${JSON.stringify(usuario)}`);
  } catch (err) {
    next(err);
  }
}

async function getUsuario(req, res, next) {
  try {
    const id = req.params.id;

    const usuario = await UsuarioService.getUsuario(id);
    if (usuario) {
      res.send(usuario);
    } else {
      res.send("Usuario não encontrado!");
    }
    logger.info("GET /usuario");
  } catch (err) {
    next(err);
  }
}

async function deleteUsuario(req, res, next) {
  try {
    const id = req.params.id;

    const retorno = await UsuarioService.deleteUsuario(id);
    res.send(retorno);
    logger.info("DELETE /usuario");
  } catch (err) {
    next(err);
  }
}

async function updateUsuario(req, res, next) {
  try {
    let usuario = req.body;

    if (
      !usuario.idusuario ||
      !usuario.nome ||
      !usuario.usuario ||
      !usuario.email ||
      !usuario.telefone ||
      !usuario.funcao ||
      !usuario.setor ||
      !usuario.senha ||
      !usuario.idnivel ||
      !usuario.foto
    ) {
      throw new Error("Todos os campos são obrigatórios!");
    }

    usuario = await UsuarioService.updateUsuario(usuario);
    res.send(usuario);
    logger.info(`PUT /usuario - ${JSON.stringify(usuario)}`);
  } catch (err) {
    next(err);
  }
}

async function getUsuarioAuth(req, res, next) {
  try {
    console.log("entrou aqui");
    console.log(req.query);
    const usuario = await UsuarioService.getUsuarioAuth(req.query);

    res.send(usuario);
    logger.info("GET /usuario/nome");
  } catch (err) {
    next(err);
  }
}

export default {
  createUsuario,
  getUsuarios,
  getUsuario,
  deleteUsuario,
  updateUsuario,
  getUsuarioAuth,
};
