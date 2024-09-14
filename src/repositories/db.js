import mysql from "mysql2/promise";
import dotenv from "dotenv/config";

async function connect() {
  if (global.connection && global.connection.state !== "disconnected")
    return global.connection;

  // Verifica o ambiente (STAGING ou PRODUCTION)
  const isProduction = process.env.NODE_ENV === "PRODUCTION";

  // Configurações de banco para STAGING e PRODUCTION
  const config = {
    host: isProduction
      ? process.env.HOST_BD_PRODUCTION
      : process.env.HOST_BD_STAGING,
    port: isProduction
      ? process.env.PORT_BD_PRODUCTION
      : process.env.PORT_BD_STAGING,
    user: isProduction
      ? process.env.USER_BD_PRODUCTION
      : process.env.USER_BD_STAGING,
    password: isProduction
      ? process.env.PASSWORD_BD_PRODUCTION
      : process.env.PASSWORD_BD_STAGING,
    database: isProduction
      ? process.env.DATABASE_NAME_PRODUCTION
      : process.env.DATABASE_NAME_STAGING,
  };

  try {
    const connection = await mysql.createConnection(config);
    logger.info(
      `${process.env.APP_NAME} conectado no banco de  ${
        isProduction ? "PRODUÇÃO" : "HOMOLOGAÇÃO"
      }!`
    );
    global.connection = connection;
    return connection;
  } catch (error) {
    logger.error(`Erro ao conectar no banco de dados: ${error.message}`);

    if (error.code === "ECONNREFUSED") {
      logger.error(
        "Conexão recusada. Verifique se o serviço MySQL está ativo e as credenciais estão corretas."
      );
    } else if (error.code === "ER_ACCESS_DENIED_ERROR") {
      logger.error(
        "Acesso negado. Verifique o usuário e a senha do banco de dados."
      );
    } else if (error.code === "ENOTFOUND") {
      logger.error(
        "Servidor do banco de dados não encontrado. Verifique o host configurado."
      );
    } else {
      logger.error(`Erro inesperado: ${error.code}`);
    }

    throw error; // Rethrow o erro caso precise lidar com ele em outros níveis
  }
}

connect();

export default connect;
