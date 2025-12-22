import dotenv from "dotenv";
dotenv.config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  staging: {
    client: 'mysql2',
    connection: {
      host: process.env.HOST_BD_STAGING,
      port: process.env.PORT_BD_STAGING,
      user: process.env.USER_BD_STAGING,
      password: process.env.PASSWORD_BD_STAGING,
      database: process.env.DATABASE_NAME_STAGING,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    }
  },

  production: {
    client: 'mysql2',
    connection: {
      host: process.env.HOST_BD_PRODUCTION,
      port: process.env.PORT_BD_PRODUCTION,
      user: process.env.USER_BD_PRODUCTION,
      password: process.env.PASSWORD_BD_PRODUCTION,
      database: process.env.DATABASE_NAME_PRODUCTION,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    }
  }
};
