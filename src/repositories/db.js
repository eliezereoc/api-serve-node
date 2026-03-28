import mysql from "mysql2/promise";
import dotenv from "dotenv/config";

function getLogger() {
  return global.logger ?? console;
}

function resolveDatabaseEnvironment() {
  const rawNodeEnv = (process.env.NODE_ENV ?? "").trim();
  const normalizedNodeEnv = rawNodeEnv.toUpperCase();

  if (["PRODUCTION", "PROD"].includes(normalizedNodeEnv)) {
    return {
      raw: rawNodeEnv,
      normalized: "PRODUCTION",
      isProduction: true,
    };
  }

  if (
    ["STAGING", "HOMOLOGACAO", "HOMOLOGATION", "DEVELOPMENT", "DEV", ""].includes(
      normalizedNodeEnv
    )
  ) {
    return {
      raw: rawNodeEnv,
      normalized: "STAGING",
      isProduction: false,
    };
  }

  return {
    raw: rawNodeEnv,
    normalized: "STAGING",
    isProduction: false,
    fallback: true,
  };
}

async function connect() {
  const logger = getLogger();

  // Skip conexao real durante testes
  if (process.env.NODE_ENV === "test") {
    return {
      execute: jest.fn().mockResolvedValue([[], []]),
      query: jest.fn().mockResolvedValue([[], []]),
      end: jest.fn().mockResolvedValue(undefined)
    };
  }

  const environment = resolveDatabaseEnvironment();

  // Configuracoes de banco para STAGING e PRODUCTION
  const config = {
    host: environment.isProduction
      ? process.env.HOST_BD_PRODUCTION
      : process.env.HOST_BD_STAGING,
    port: environment.isProduction
      ? process.env.PORT_BD_PRODUCTION
      : process.env.PORT_BD_STAGING,
    user: environment.isProduction
      ? process.env.USER_BD_PRODUCTION
      : process.env.USER_BD_STAGING,
    password: environment.isProduction
      ? process.env.PASSWORD_BD_PRODUCTION
      : process.env.PASSWORD_BD_STAGING,
    database: environment.isProduction
      ? process.env.DATABASE_NAME_PRODUCTION
      : process.env.DATABASE_NAME_STAGING,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };

  try {
    if (environment.fallback) {
      logger.warn(
        `${process.env.APP_NAME} recebeu NODE_ENV='${environment.raw}' e aplicou fallback para STAGING.`
      );
    }

    logger.info(
      `${process.env.APP_NAME} tentando conectar no banco com a configuracao: ${JSON.stringify({
        nodeEnvInformado: environment.raw,
        ambienteResolvido: environment.normalized,
        host: config.host,
        port: config.port,
        usuario: config.user,
        banco: config.database,
        senha: config.password,
      })}`
    );

    if (global.connection) {
      try {
        await global.connection.query("SELECT 1");
        return global.connection;
      } catch (healthCheckError) {
        logger.warn(
          `${process.env.APP_NAME} detectou conexao encerrada e vai recriar o pool. Detalhe: ${healthCheckError.message}`
        );
        try {
          await global.connection.end();
        } catch (closeError) {
          logger.warn(
            `${process.env.APP_NAME} nao conseguiu encerrar a conexao anterior: ${closeError.message}`
          );
        }
        global.connection = null;
      }
    }

    const connection = mysql.createPool(config);
    await connection.query("SELECT 1");
    logger.info(
      `${process.env.APP_NAME} conectado no banco de ${environment.normalized}!`
    );
    global.connection = connection;
    return connection;
  } catch (error) {
    logger.error(`Erro ao conectar no banco de dados: ${error.message}`);

    if (error.code === "ECONNREFUSED") {
      logger.error(
        "Conexao recusada. Verifique se o servico MySQL esta ativo e as credenciais estao corretas."
      );
    } else if (error.code === "ER_ACCESS_DENIED_ERROR") {
      logger.error(
        "Acesso negado. Verifique o usuario e a senha do banco de dados."
      );
    } else if (error.code === "ENOTFOUND") {
      logger.error(
        "Servidor do banco de dados nao encontrado. Verifique o host configurado."
      );
    } else {
      logger.error(`Erro inesperado: ${error.code}`);
    }

    throw error;
  }
}

export default connect;
