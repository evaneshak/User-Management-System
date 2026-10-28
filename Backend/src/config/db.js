const mysql = require('mysql2/promise');
const path = require('node:path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const pool = mysql.createPool({
  host: process.env.DB_HOST || process.env.HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD ?? process.env.PASSWORD ?? '',
  database: process.env.DB_NAME || process.env.DATABASE || 'web_app',
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true,
  decimalNumbers: false
});
module.exports = pool;
