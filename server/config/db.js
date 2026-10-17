import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Vérification si l'environnement nécessite une connexion SSL (ex: Aiven en production)
const sslOption = process.env.DB_HOST && process.env.DB_HOST.includes('aivencloud.com')
  ? { rejectUnauthorized: false }
  : false;

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sandrine_brend',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: sslOption
});

export default pool;