import connect from "./db.js";
import genericoService from "../services/auth.service.js";

async function createUsuario(usuario) {
  const conn = await connect();
  try {
    const sql =
      "INSERT INTO usuario ( nome, senha, email, active ) values ( ?, ?, ?, ? ) ";
    const values = [usuario.nome, usuario.senha, usuario.email, usuario.active];

    const [row] = await conn.query(sql, values);
    return {
      status: "sucesso",
      message: "Usuário cadastrado com sucesso!",
      id: row.insertId,
    };
  } catch (error) {
    throw {
      status: 500,
      message: "Erro ao acessar o banco de dados. (Code: 1)",
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

async function getUsuarioByEmail(email) {
  const conn = await connect();
  try {
    const [row] = await conn.query(
      "SELECT email, active FROM usuario WHERE email = ? ",
      [email]
    );
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
  const conn = await connect();
  try {
    // Verifica se o usuário existe e está ativo
    const SELECT_USUARIO_QUERY = `SELECT 1 
                                  FROM usuario 
                                  WHERE email = ?
                                  AND active != 'N'`;
    const [rows] = await conn.query(SELECT_USUARIO_QUERY, [usuario.email]);

    if (rows.length === 0) {
      return {
        status: "erro"
      };
    } else {
      // Constrói a query de UPDATE dinamicamente
      const camposPermitidos = ["nome", "senha", "active"];
      const camposParaAtualizar = [];
      const valores = [];

      for (const campo of camposPermitidos) {
        if (usuario[campo] !== undefined) {
          camposParaAtualizar.push(`${campo} = ?`);
          valores.push(usuario[campo]);
        }
      }

      if (camposParaAtualizar.length === 0) {
        return {
          status: "null"
        };
      }

      const UPDATE_USUARIO_QUERY = `UPDATE usuario 
                                    SET ${camposParaAtualizar.join(", ")}
                                    WHERE email = ?`;

      valores.push(usuario.email); // Adiciona o email para a condição WHERE 
      
      await conn.query(UPDATE_USUARIO_QUERY, valores);

      return {
        status: "sucesso"
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
  getUsuarioByEmail,
};
