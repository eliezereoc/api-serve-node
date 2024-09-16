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
        usuario.active,
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
    throw {
      status: 500,
      message: "Erro ao acessar o banco de dados.",
      error: error.message,
    };
  }
}

async function getUsuarios() {
  const conn = await connect();
  try {
    const [row] = await conn.query("SELECT * FROM usuario WHERE active != 'N'");

    // Remove a senha do resultado
    row.forEach((usuario) => delete usuario.senha);

    return row;
  } catch (error) {
    throw {
      status: 500,
      message: "Erro ao acessar o banco de dados.",
      error: error.message,
    };
  }
}

async function getUsuario(id) {
  const conn = await connect();
  try {
    const [row] = await conn.query(
      "SELECT * FROM usuario WHERE id = ? AND active != 'N'",
      [id]
    );

    // Remove a senha do resultado
    row.forEach((usuario) => delete usuario.senha);

    return row;
  } catch (error) {
    throw {
      status: 500,
      message: "Erro ao acessar o banco de dados.",
      error: error.message,
    };
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
    throw {
      status: 500,
      message: "Erro ao acessar o banco de dados.",
      error: error.message,
    };
  }
}

async function deleteUsuario(id) {
  const conn = await connect();
  try {
    const sql = "DELETE FROM usuario WHERE id = ?";
    const [row] = await conn.query(sql, [id]);
    console.log(row.affectedRows);
    
    if (row.affectedRows === 0) {
      return {
        status: "erro",
        message: "Registro não encontrado!",
      };
    }
    return {
      status: "sucesso",
      message: "Registro removido com sucesso!",
      id: id,
    };
  } catch (error) {
    throw {
      status: 500,
      message: "Erro ao acessar o banco de dados.",
      error: error.message,
    };
  }
}

async function updateUsuario(usuario) {
  try {
    const conn = await connect();

    // Consulta para selecionar um usuário com base no ID ou email
    const SELECT_USUARIO_QUERY = `SELECT * 
                                  FROM usuario 
                                  WHERE email = ?
                                  AND active != 'N'`;
    const [rows] = await conn.query(SELECT_USUARIO_QUERY, [usuario.email]);

    if (rows.length === 0) {
      return {
        status: "erro",       
        message: `Não foi possível encontrar o usuário com o email ${usuario.email}.`,
      };
    } else {
      // Construa a consulta de atualização dinamicamente
      let updateFields = [];
      let values = [];

      updateFields.push("nome = ?");
      values.push(usuario.nome);

      if (usuario.senha) {
        updateFields.push("senha = ?");
        values.push(usuario.senha);
      }

      updateFields.push("active = ?");
      values.push(usuario.active);

      const UPDATE_USUARIO_QUERY = `UPDATE usuario 
                                    SET ${updateFields.join(", ")} 
                                    WHERE email = ?`;
      const [result] = await conn.query(UPDATE_USUARIO_QUERY, [
        ...values,
        usuario.email,
      ]);

      return {
        status: "sucesso",
        message: "Registro atualizado com sucesso!",
      };
    }
  } catch (error) {
    throw {
      status: 500,
      message: "Erro ao acessar o banco de dados.",
      error: error.message,
    };
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
