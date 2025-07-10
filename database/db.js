import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';
import dbConfig from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Détermine l'environnement
const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

// Crée un pool de connexions MySQL/MariaDB
const pool = mysql.createPool({
  host: config.host,
  port: config.port,
  user: config.user,
  password: config.password,
  database: config.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Singleton pour obtenir le pool
const getDb = () => pool;

export default getDb;