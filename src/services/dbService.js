import db from '../database/connection.js';

// Service générique pour interagir avec la base de données
const dbService = {
  // Récupérer tous les enregistrements d'une table
  getAll: async (table) => {
    try {
      const [rows] = await db.query(`SELECT * FROM ${table}`);
      return rows;
    } catch (error) {
      console.error(`Error getting all records from ${table}:`, error);
      throw error;
    }
  },

  // Récupérer un enregistrement par ID
  getById: async (table, id) => {
    try {
      const [rows] = await db.query(`SELECT * FROM ${table} WHERE id = ?`, [id]);
      return rows[0];
    } catch (error) {
      console.error(`Error getting record from ${table} by ID:`, error);
      throw error;
    }
  },

  // Créer un nouvel enregistrement
  create: async (table, data) => {
    try {
      const columns = Object.keys(data).join(', ');
      const placeholders = Object.keys(data).map(() => '?').join(', ');
      const values = Object.values(data);

      const [result] = await db.query(
        `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`,
        values
      );
      
      return { id: result.insertId, ...data };
    } catch (error) {
      console.error(`Error creating record in ${table}:`, error);
      throw error;
    }
  },

  // Mettre à jour un enregistrement
  update: async (table, id, data) => {
    try {
      const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
      const values = [...Object.values(data), id];

      const [result] = await db.query(
        `UPDATE ${table} SET ${setClause} WHERE id = ?`,
        values
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error updating record in ${table}:`, error);
      throw error;
    }
  },

  // Supprimer un enregistrement
  delete: async (table, id) => {
    try {
      const [result] = await db.query(`DELETE FROM ${table} WHERE id = ?`, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error deleting record from ${table}:`, error);
      throw error;
    }
  },

  // Exécuter une requête personnalisée
  query: async (sql, params = []) => {
    try {
      const [rows] = await db.query(sql, params);
      return rows;
    } catch (error) {
      console.error('Error executing custom query:', error);
      throw error;
    }
  }
};

export default dbService;