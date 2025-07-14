// User Model
const db = require('../connection');

const UserModel = {
  // Get all users
  getAll: async () => {
    try {
      const result = await db.query('SELECT * FROM users ORDER BY created_at DESC');
      return result.rows;
    } catch (error) {
      console.error('Error in getAll users:', error);
      throw error;
    }
  },

  // Get user by ID
  getById: async (id) => {
    try {
      const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error in getById user:', error);
      throw error;
    }
  },

  // Get user by email
  getByEmail: async (email) => {
    try {
      const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0];
    } catch (error) {
      console.error('Error in getByEmail user:', error);
      throw error;
    }
  },

  // Create a new user
  create: async (userData) => {
    const { name, email, password_hash, role } = userData;
    try {
      const result = await db.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, email, password_hash, role]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in create user:', error);
      throw error;
    }
  },

  // Update a user
  update: async (id, userData) => {
    const { name, email, role, is_active } = userData;
    try {
      const result = await db.query(
        'UPDATE users SET name = $1, email = $2, role = $3, is_active = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
        [name, email, role, is_active, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in update user:', error);
      throw error;
    }
  },

  // Update password
  updatePassword: async (id, passwordHash) => {
    try {
      const result = await db.query(
        'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2 RETURNING id, email, name, role',
        [passwordHash, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in updatePassword:', error);
      throw error;
    }
  },

  // Delete a user
  delete: async (id) => {
    try {
      await db.query('DELETE FROM users WHERE id = $1', [id]);
      return true;
    } catch (error) {
      console.error('Error in delete user:', error);
      throw error;
    }
  }
};

module.exports = UserModel;