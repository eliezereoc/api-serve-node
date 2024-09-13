import connect from "./db.js";
import genericoService from "../services/auth.service.js";

async function createUsuario(usuario) {
  try {
    const conn = await connect();
    let sql = "select 1 from usuarios where usuario = ?";
    let [linhas] = await conn.query(sql, [usuario.usuario]);

    // verifica se foi retornado algum usuário com aquele nome
    if (linhas.length === 0) {
      sql =
        "insert into usuarios ( idnivel, usuario, nome, senha, email, telefone, funcao, setor, foto ) " +
        "values ( ?, ?, ?, ?, ?, ?, ?, ?, ? ) ";

      const values = [
        usuario.idnivel,
        usuario.usuario,
        usuario.nome,
        usuario.senha,
        usuario.email,
        usuario.telefone,
        usuario.funcao,
        usuario.setor,
        usuario.foto,
      ];
      // Efetua a transação no banco de dados
      [linhas] = await conn.query(sql, values);
      return await genericoService.retornoInsert(
        linhas.insertId,
        usuario.idnivel,
        usuario.usuario,
        usuario.nome,
        "ok"
      );
      /*{
        status: "ok",
        dados: {
          idusuario: linhas.insertId,
          idnivel: usuario.idnivel,
          usuario: usuario.usuario,
          nome: usuario.nome,
        },
      };*/
      // return await Usuario.create(usuario);
    } else {
      return await genericoService.retornoInsert(
        linhas.insertId,
        usuario.idnivel,
        usuario.usuario,
        usuario.nome,
        "erro"
      );
      /*{
        status: "erro",
        dados: {
          info: "Registro já existe.",
        },
      };*/
    }
  } catch (error) {
    console.log(error.detail);
    throw error;
  }
}

async function getUsuarios() {
  const conn = await connect();
  try {
    const [linhas] = await conn.query("SELECT * FROM usuario");

    // Remove a senha do resultado
    linhas.forEach((usuario) => delete usuario.senha);

    return linhas;
  } catch (error) {
    throw error;
  }
}

async function getUsuario(id) {
  const conn = await connect();
  try {
    const [linhas] = await conn.query("SELECT * FROM usuario WHERE id = ?", [id]);

    // Remove a senha do resultado
    linhas.forEach((usuario) => delete usuario.senha);    

    return linhas;
  } catch (error) {
    throw error;
  }
}

async function getUsuarioAuth(usuario) {
  const conn = await connect();
  try {
    const [linhas] = await conn.query(
      "SELECT * FROM usuario WHERE email = ? LIMIT 1",
      [usuario.usuario]
    );

    if (linhas.length > 0) {
      if (linhas[0].senha === usuario.senha)
        return {
          status: "ok",
          info: "Usuário existente.",
          usuario: linhas,
        };
      return { status: "erro", message: "Usuário ou senha invalido!" };
    }
    return { status: "erro", message: "Usuário ou senha invalido!" };
  } catch (error) {
    throw error;
  }
}

async function deleteUsuario(id) {
  const conn = await connect();
  try {
    let sql = "delete from usuarios where idusuario = ?";
    let [linhas] = await conn.query(sql, [id]);
    //console.log(linhas.affectedRows);
    return await genericoService.retornoDelete(
      id,
      linhas.info,
      linhas.affectedRows,
      "ok"
    );
    /*{
      status: "ok",
      dados: {
        idusuario: id,
        info: linhas.info,
        linhasalteradas: linhas.affectedRows,
      },
    };*/
  } catch (error) {
    throw error;
  }
}

async function updateUsuario(usuario) {
  try {
    const conn = await connect();
    let sql =
      "select usuario from usuarios where (idusuario = ? or usuario = ? )";
    let [linhas] = await conn.query(sql, [usuario.idusuario, usuario.usuario]);

    if (linhas.length === 0) {
      retorno = "Não existe esse cadastro.";
    } else {
      sql =
        "update usuarios set idnivel = ? , usuario = ? ,nome = ?, senha = ?, " +
        " email = ?, telefone = ?, funcao = ?, setor = ?, foto = ? where idusuario = ?";

      let values = [
        usuario.idnivel,
        usuario.usuario,
        usuario.nome,
        usuario.senha,
        usuario.email,
        usuario.telefone,
        usuario.funcao,
        usuario.setor,
        usuario.foto,
        usuario.idusuario,
      ];
      //console.log("linhas");
      [linhas] = await conn.query(sql, values);

      return await genericoService.retornoUpdate(
        usuario.idusuario,
        linhas.info,
        linhas.affectedRows,
        "ok"
      );
      /*{
        status: "ok",
        dados: {
          idusuario: usuario.idusuario,
          info: linhas.info,
          linhasalteradas: linhas.changedRows,
        },
      };*/
    }
  } catch (error) {
    throw error;
  }
}

export default {
  createUsuario,
  getUsuarios,
  getUsuario,
  getUsuarioAuth,
  updateUsuario,
  deleteUsuario,
};
