// Client Model
const db = require('../connection');

const ClientModel = {
  // Get all clients
  getAll: async () => {
    try {
      const result = await db.query(`
        SELECT c.*, p.name as manager_name 
        FROM clients c
        LEFT JOIN profiles p ON c.manager_id = p.id
        ORDER BY c.created_at DESC
      `);
      return result.rows;
    } catch (error) {
      console.error('Error in getAll clients:', error);
      throw error;
    }
  },

  // Get clients by manager ID
  getByManager: async (managerId) => {
    try {
      const result = await db.query(`
        SELECT c.*, p.name as manager_name 
        FROM clients c
        LEFT JOIN profiles p ON c.manager_id = p.id
        WHERE c.manager_id = $1
        ORDER BY c.created_at DESC
      `, [managerId]);
      return result.rows;
    } catch (error) {
      console.error('Error in getByManager clients:', error);
      throw error;
    }
  },

  // Get client by ID
  getById: async (id) => {
    try {
      const result = await db.query(`
        SELECT c.*, p.name as manager_name 
        FROM clients c
        LEFT JOIN profiles p ON c.manager_id = p.id
        WHERE c.id = $1
      `, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error in getById client:', error);
      throw error;
    }
  },

  // Get client by user ID (for client users)
  getByUserId: async (userId) => {
    try {
      const result = await db.query(`
        SELECT c.*, p.name as manager_name 
        FROM clients c
        LEFT JOIN profiles p ON c.manager_id = p.id
        WHERE c.user_id = $1
      `, [userId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error in getByUserId client:', error);
      throw error;
    }
  },

  // Create a new client
  create: async (clientData) => {
    const { 
      name, 
      email, 
      phone, 
      address, 
      company, 
      manager_id, 
      status, 
      user_id = null,
      notes = []
    } = clientData;
    
    try {
      const result = await db.query(
        `INSERT INTO clients 
          (name, email, phone, address, company, manager_id, status, user_id, notes) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
         RETURNING *`,
        [name, email, phone, address, company, manager_id, status, user_id, notes]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in create client:', error);
      throw error;
    }
  },

  // Update a client
  update: async (id, clientData) => {
    const { 
      name, 
      email, 
      phone, 
      address, 
      company, 
      manager_id, 
      status, 
      notes,
      total_amount
    } = clientData;
    
    try {
      const result = await db.query(
        `UPDATE clients 
         SET name = $1, 
             email = $2, 
             phone = $3, 
             address = $4, 
             company = $5, 
             manager_id = $6, 
             status = $7, 
             notes = $8,
             total_amount = $9,
             updated_at = NOW() 
         WHERE id = $10 
         RETURNING *`,
        [name, email, phone, address, company, manager_id, status, notes, total_amount, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in update client:', error);
      throw error;
    }
  },

  // Update client status
  updateStatus: async (id, status) => {
    try {
      const result = await db.query(
        'UPDATE clients SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        [status, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in updateStatus client:', error);
      throw error;
    }
  },

  // Delete a client
  delete: async (id) => {
    try {
      await db.query('DELETE FROM clients WHERE id = $1', [id]);
      return true;
    } catch (error) {
      console.error('Error in delete client:', error);
      throw error;
    }
  }
};

module.exports = ClientModel;