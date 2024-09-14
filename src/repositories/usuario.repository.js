import connect from "./db.js";
import genericoService from "../services/auth.service.js";

async function createUsuario(usuario) {
  const conn = await connect();
  try {
    let [row] = await conn.query("SELECT 1 FROM usuario WHERE email = ?", [
      usuario.email,
    ]);

    // verifica se foi retornado algum usuário com aquele nome
    if (row.length === 0) {
      const sql =
        "INSERT INTO usuario ( nome, senha, email, active ) " +
        "values ( ?, ?, ?, ? ) ";

      const values = [
        usuario.nome,
        usuario.senha,
        usuario.email,
        usuario.actives,
      ];

      // Efetua a transação no banco de dados
      [row] = await conn.query(sql, values);
      return {
        status: "sucesso",
        message: "Usuário cadastrado com sucesso!",
        id: row.insertId,
      };
    } else {
      return { status: "erro", message: "Usuário já cadastrado!" };
    }
  } catch (error) {
    console.log(error.detail);
    throw error;
  }
}

async function getUsuarios() {
  const conn = await connect();
  try {
    const [row] = await conn.query("SELECT * FROM usuario");

    // Remove a senha do resultado
    row.forEach((usuario) => delete usuario.senha);

    return row;
  } catch (error) {
    throw error;
  }
}

async function getUsuario(id) {
  const conn = await connect();
  try {
    const [row] = await conn.query("SELECT * FROM usuario WHERE id = ?", [id]);

    // Remove a senha do resultado
    row.forEach((usuario) => delete usuario.senha);

    return row;
  } catch (error) {
    throw error;
  }
}

async function getUsuarioAuth(usuario) {
  const conn = await connect();
  try {
    const [row] = await conn.query(
      "SELECT * FROM usuario WHERE email = ? LIMIT 1",
      [usuario.usuario]
    );

    if (row.length > 0) {
      if (row[0].senha === usuario.senha)
        return {
          status: "ok",
          info: "Usuário existente.",
          usuario: row,
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
    let sql = "DELETE FROM usuario WHERE id = ?";
    let [row] = await conn.query(sql, [id]);
    if (row.affectedRows === 0) {
      return {
        status: "erro",
        message: "Registro não encontrado!",
      };
    } else { 
      return {
        status: "sucesso",
        message: "Registro removido com sucesso!", 
        id: id        
      };
    }   
  } catch (error) {
    throw error;
  }
}

async function updateUsuario(usuario) {
  try {
    const conn = await connect();
    let sql =
      "select usuario from usuarios where (idusuario = ? or usuario = ? )";
    let [row] = await conn.query(sql, [usuario.idusuario, usuario.usuario]);

    if (row.length === 0) {
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
      //console.log("row");
      [row] = await conn.query(sql, values);

      return await genericoService.retornoUpdate(
        usuario.idusuario,
        row.info,
        row.affectedRows,
        "ok"
      );
      /*{
        status: "ok",
        dados: {
          idusuario: usuario.idusuario,
          info: row.info,
          linhasalteradas: row.changedRows,
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
