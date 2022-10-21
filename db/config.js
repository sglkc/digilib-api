require('dotenv').config();

module.exports = {
  "username": process.env.DB_USER || 'root',
  "password": process.env.DB_PASSWORD,
  "database": process.env.DB_NAME || 'jracademy',
  "host": process.env.DB_HOST || 'localhost',
  "port": process.env.DB_PORT || 3306,
  "dialect": 'mysql',
  "logging": process.env.NODE_ENV === 'development' ? console.log : false,
};
