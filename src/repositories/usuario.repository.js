import connect from "./db.js";
import genericoService from "../services/auth.service.js";

async function createUsuario(usuario) {
  const conn = await connect();
  try {
    const sql = "INSERT INTO usuario ( nome, senha, email, usuario ) values ( ?, ?, ?, ? ) ";
    const values = [usuario.nome, usuario.senha, usuario.email, usuario.usuario];

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

async function getUsuarioByUsuario(usuario) {
  const conn = await connect();
  try {
    const [row] = await conn.query(
      "SELECT usuario, active FROM usuario WHERE usuario = ? ",
      [usuario]
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
      "SELECT * FROM usuario WHERE usuario = ? LIMIT 1",
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
    const SELECT_USUARIO_QUERY = `SELECT *
                                  FROM usuario 
                                  WHERE usuario = ?
                                  AND active != 'N'`;
    const [rows] = await conn.query(SELECT_USUARIO_QUERY, [usuario.usuario]);
 
    if (rows.length === 0) {      
      return {
        status: "erro"
      };
    } else {
      // Constrói a query de UPDATE dinamicamente
      const camposPermitidos = ["nome", "email", "senha", "active"];
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
                                    WHERE usuario = ?`;

      valores.push(usuario.usuario); // Adiciona o usuario para a condição WHERE 
      
      const [result] = await conn.query(UPDATE_USUARIO_QUERY, valores);

      // Verifica se alguma linha foi afetada
      if (result.affectedRows === 0) {
        return {
          status: "null" 
        };
      }

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
  getUsuarioByUsuario,
};
