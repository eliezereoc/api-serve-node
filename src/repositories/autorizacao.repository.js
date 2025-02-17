import connect from "./db.js";

async function getUsuarioAuth(usuario) {
  const conn = await connect();
  try {
    const [row] = await conn.query("SELECT * FROM usuario WHERE usuario = ? LIMIT 1", [usuario.usuario]);    
        
    if (row.length > 0) {
      return row[0];
    }
    return { status: "erro" };
  } catch (error) {
    throw {
      status: 500,
      message: "Erro ao acessar o banco de dados.",
      error: error.message,
    };
  }
}

export default {
  getUsuarioAuth,
};
