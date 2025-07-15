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

// Test de connexion
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT NOW() AS now');
    console.log('Database connected successfully at:', rows[0].now);
    connection.release();
    return true;
  } catch (err) {
    console.error('Database connection error:', err);
    return false;
  }
};

// Export du pool et d'une méthode query
export default {
  query: (sql, params) => pool.execute(sql, params),
  getConnection: () => pool.getConnection(),
  testConnection
};