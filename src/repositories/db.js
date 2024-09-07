import mysql from "mysql2/promise";
import dotenv from "dotenv/config";

async function connect() {
  if (global.connection && global.connection.state !== "disconnected")
    return global.connection;

  const connection = mysql.createConnection({
    host: process.env.HOST_BD,
    port: process.env.PORT_BD,
    user: process.env.USER_BD,
    password: process.env.PASSWORD_BD,
    database: process.env.DATABASE_NAME,
  });
  console.log("Conectou no MySQL!");
  global.connection = connection;
  return connection;
}

connect();

export default connect;
