import UsuarioService from "../services/usuario.service.js";

async function createUsuario(req, res, next) {
  try {
    const usuario = req.body;
    if (!usuario.nome || !usuario.email || !usuario.senha || !usuario.active)
      throw new Error(
        `POST/usuarios - Todos os campos são obrigatórios - ${JSON.stringify(
          usuario
        )}`
      );

    const novo_usuario = await UsuarioService.createUsuario(usuario);

    if (novo_usuario.status === "erro") {
      logger.warn(`POST /usuario - ${JSON.stringify(novo_usuario)}`);
      return res.status(409).send(novo_usuario);
    }
    logger.info(`POST /usuario - ${JSON.stringify(novo_usuario)}`);
    return res.status(200).send(novo_usuario);
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

    if (usuario.length > 0) {
      logger.info(`GET /usuario: ${JSON.stringify(usuario)}`);
      return res.status(200).send(usuario);
    }

    logger.warn(`GET /usuario - ID: ${id} não encontrado`);
    return res.status(404).send({ message: "Registro não encontrado!" });
  } catch (err) {
    next(err);
  }
}

async function deleteUsuario(req, res, next) {
  try {    
    const {id} = req.params;
    const authenticatedUserId = req.user.id; // ID do usuário autenticado no token
    
    if (!id) throw new Error("ID é obrigatório!");
  
    const result = await UsuarioService.deleteUsuario(id, authenticatedUserId);

    if (result.status === "erro") {
      logger.warn(`DELETE /usuario - ${JSON.stringify(result)}`);
      return res.status(result.code || 500).send(result);
    }

    logger.info(`DELETE /usuario - ${JSON.stringify(result)}`); 
    return res.status(200).send(result);
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
