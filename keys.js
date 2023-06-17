require('dotenv').config();

module.exports = {
  database: {
    host: process.env.SQL_HOST,
    port: process.env.SQL_PORT,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE
  },
  mode: {
    developer: process.env.DEVELOPER
  }
};
