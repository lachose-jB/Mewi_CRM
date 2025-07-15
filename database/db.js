import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import dbConfig from './config.js';

// Charger les variables d'environnement
dotenv.config();

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