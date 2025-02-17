import connect from "./db.js";

async function createUsuario(usuario) {
  const conn = await connect();
  try {
    const sql = "INSERT INTO usuario ( nome, senha, email, usuario ) values ( ?, ?, ?, ? ) ";
    const values = [usuario.nome, usuario.senha, usuario.email, usuario.usuario];
    const [row] = await conn.query(sql, values);

    if (row.affectedRows === 0) {
      return {
        status: "erro"
      };
    }
    
    return {
      status: "sucesso"     
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

async function updateUsuario(usuario, condicaoAtivo = "S") {
  const conn = await connect();  
  try {
    // Verifica se o usuário existe com base na condição (ativo ou inativo)
    const SELECT_USUARIO_QUERY = `SELECT * FROM usuario WHERE usuario = ? AND active = ?`;
    const [rows] = await conn.query(SELECT_USUARIO_QUERY, [usuario.usuario, condicaoAtivo]);

    if (rows.length === 0) {
      return { status: "erro" };
    }

    // Define os campos permitidos para atualização
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
      return { status: "null" };
    }

    const UPDATE_USUARIO_QUERY = `UPDATE usuario SET ${camposParaAtualizar.join(", ")} WHERE usuario = ?`;
    valores.push(usuario.usuario);

    const [result] = await conn.query(UPDATE_USUARIO_QUERY, valores);

    return result.affectedRows > 0 ? { status: "sucesso" } : { status: "null" };
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
  deleteUsuario,
  updateUsuario,
  getUsuarioByEmail,
  getUsuarioByUsuario,
};
