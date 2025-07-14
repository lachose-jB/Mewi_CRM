// Database Configuration pour MariaDB/MySQL sur WampServer
const dbConfig = {
  development: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    database: process.env.DB_NAME || 'mewidb',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Mewi2025!', 
  },
  production: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  test: {
    host: process.env.TEST_DB_HOST || 'localhost',
    port: parseInt(process.env.TEST_DB_PORT || '3306'),
    database: process.env.TEST_DB_NAME || 'mewidb_test',
    user: process.env.TEST_DB_USER || 'root',
    password: process.env.TEST_DB_PASSWORD || '',
  }
};

module.exports = dbConfig;