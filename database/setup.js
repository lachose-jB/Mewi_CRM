import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fonction pour créer la base de données et les tables
async function setupDatabase() {
  try {
    // Configuration de la base de données
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Mewi2025!',
    };

    // Nom de la base de données
    const dbName = process.env.DB_NAME || 'mewidb';

    // Créer une connexion sans spécifier de base de données
    const connection = await mysql.createConnection(dbConfig);

    // Créer la base de données si elle n'existe pas
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`Base de données '${dbName}' créée ou déjà existante.`);

    // Utiliser la base de données
    await connection.query(`USE ${dbName}`);

    // Lire le fichier de schéma
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSQL = await fs.readFile(schemaPath, 'utf8');

    // Diviser le fichier en instructions SQL individuelles
    const statements = schemaSQL
      .split(';')
      .filter(statement => statement.trim() !== '');

    // Exécuter chaque instruction SQL
    for (const statement of statements) {
      await connection.query(statement);
    }

    console.log('Schéma de base de données créé avec succès.');
    
    // Fermer la connexion
    await connection.end();
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la configuration de la base de données:', error);
    return false;
  }
}

// Exécuter la configuration
setupDatabase()
  .then(success => {
    if (success) {
      console.log('Configuration de la base de données terminée avec succès.');
    } else {
      console.error('Échec de la configuration de la base de données.');
    }
  })
  .catch(err => {
    console.error('Erreur inattendue:', err);
  });