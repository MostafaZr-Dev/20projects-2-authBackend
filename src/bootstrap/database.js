const mysql = require("mysql2/promise");

const { DB_NAME, DB_HOST, DB_USER, DB_PASSWORD, DB_PORT } = process.env;

const createDB = async () => {
  return await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    database: DB_NAME,
  });
};

module.exports = createDB;
