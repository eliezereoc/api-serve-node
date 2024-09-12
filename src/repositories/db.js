import mysql from "mysql2/promise";
import dotenv from "dotenv/config";

async function connect() {
  if (global.connection && global.connection.state !== "disconnected")
    return global.connection;

  // Verifica o ambiente (STAGING ou PRODUCTION)
  const isProduction = process.env.NODE_ENV === "PRODUCTION";

  // Configurações de banco para STAGING e PRODUCTION
  const config = {
    host: isProduction ? process.env.HOST_BD_PRODUCTION : process.env.HOST_BD_STAGING,
    port: isProduction ? process.env.PORT_BD_PRODUCTION : process.env.PORT_BD_STAGING,
    user: isProduction ? process.env.USER_BD_PRODUCTION : process.env.USER_BD_STAGING,
    password: isProduction
      ? process.env.PASSWORD_BD_PRODUCTION
      : process.env.PASSWORD_BD_STAGING,
    database: isProduction
      ? process.env.DATABASE_NAME_PRODUCTION
      : process.env.DATABASE_NAME_STAGING,
  };

  const connection = await mysql.createConnection(config);
  logger.info(
    `${process.env.APP_NAME} conectado no banco de  ${
      isProduction ? "PRODUÇÃO" : "HOMOLOGAÇÃO"
    }!`
  );
  global.connection = connection;
  return connection;
}

connect();

export default connect;
