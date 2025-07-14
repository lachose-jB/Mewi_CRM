// Database Connection Manager pour MariaDB/MySQL sur WampServer
const mysql = require('mysql2/promise');
const dbConfig = require('./config');

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
(async () => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT NOW() AS now');
    console.log('Database connected successfully at:', rows[0].now);
    connection.release();
  } catch (err) {
    console.error('Database connection error:', err);
  }
})();

// Export du pool et d'une méthode query
module.exports = {
  query: (sql, params) => pool.execute(sql, params),
  getConnection: () => pool.getConnection()
};