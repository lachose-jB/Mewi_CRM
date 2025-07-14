// Communication Model
const db = require('../connection');

const CommunicationModel = {
  // Get all communications
  getAll: async () => {
    try {
      const result = await db.query(`
        SELECT c.*, cl.name as client_name, p.name as user_name
        FROM communications c
        JOIN clients cl ON c.client_id = cl.id
        LEFT JOIN profiles p ON c.user_id = p.id
        ORDER BY c.created_at DESC
      `);
      return result.rows;
    } catch (error) {
      console.error('Error in getAll communications:', error);
      throw error;
    }
  },

  // Get communications by client ID
  getByClient: async (clientId) => {
    try {
      const result = await db.query(`
        SELECT c.*, p.name as user_name
        FROM communications c
        LEFT JOIN profiles p ON c.user_id = p.id
        WHERE c.client_id = $1
        ORDER BY c.created_at DESC
      `, [clientId]);
      return result.rows;
    } catch (error) {
      console.error('Error in getByClient communications:', error);
      throw error;
    }
  },

  // Get communications by user ID (sender)
  getByUser: async (userId) => {
    try {
      const result = await db.query(`
        SELECT c.*, cl.name as client_name
        FROM communications c
        JOIN clients cl ON c.client_id = cl.id
        WHERE c.user_id = $1
        ORDER BY c.created_at DESC
      `, [userId]);
      return result.rows;
    } catch (error) {
      console.error('Error in getByUser communications:', error);
      throw error;
    }
  },

  // Get communication by ID
  getById: async (id) => {
    try {
      const result = await db.query(`
        SELECT c.*, cl.name as client_name, p.name as user_name
        FROM communications c
        JOIN clients cl ON c.client_id = cl.id
        LEFT JOIN profiles p ON c.user_id = p.id
        WHERE c.id = $1
      `, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error in getById communication:', error);
      throw error;
    }
  },

  // Create a new communication
  create: async (communicationData) => {
    const { 
      client_id, 
      user_id, 
      type, 
      subject, 
      content,
      scheduled_at,
      metadata
    } = communicationData;
    
    try {
      const result = await db.query(
        `INSERT INTO communications 
          (client_id, user_id, type, subject, content, status, scheduled_at, metadata) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
         RETURNING *`,
        [
          client_id, 
          user_id, 
          type, 
          subject, 
          content, 
          scheduled_at ? 'scheduled' : 'sent',
          scheduled_at,
          metadata
        ]
      );
      
      // Update client last_contact
      await db.query(
        `UPDATE clients 
         SET last_contact = NOW(), 
             updated_at = NOW() 
         WHERE id = $1`,
        [client_id]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Error in create communication:', error);
      throw error;
    }
  },

  // Update a communication
  update: async (id, communicationData) => {
    const { 
      type, 
      subject, 
      content,
      status,
      scheduled_at,
      sent_at,
      metadata
    } = communicationData;
    
    try {
      const result = await db.query(
        `UPDATE communications 
         SET type = $1, 
             subject = $2, 
             content = $3,
             status = $4,
             scheduled_at = $5,
             sent_at = $6,
             metadata = $7
         WHERE id = $8 
         RETURNING *`,
        [type, subject, content, status, scheduled_at, sent_at, metadata, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in update communication:', error);
      throw error;
    }
  },

  // Update communication status
  updateStatus: async (id, status) => {
    try {
      const result = await db.query(
        `UPDATE communications 
         SET status = $1,
             ${status === 'sent' ? 'sent_at = NOW(),' : ''}
             ${status === 'delivered' || status === 'read' || status === 'responded' ? 'metadata = jsonb_set(coalesce(metadata, \'{}\'), \'{status_updated_at}\', to_jsonb(NOW())),' : ''}
             updated_at = NOW()
         WHERE id = $2 
         RETURNING *`,
        [status, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in updateStatus communication:', error);
      throw error;
    }
  },

  // Delete a communication
  delete: async (id) => {
    try {
      await db.query('DELETE FROM communications WHERE id = $1', [id]);
      return true;
    } catch (error) {
      console.error('Error in delete communication:', error);
      throw error;
    }
  },

  // Get scheduled communications that need to be sent
  getScheduledForSending: async () => {
    try {
      const result = await db.query(`
        SELECT c.*, cl.name as client_name, cl.email as client_email, cl.phone as client_phone
        FROM communications c
        JOIN clients cl ON c.client_id = cl.id
        WHERE c.status = 'scheduled' AND c.scheduled_at <= NOW()
        ORDER BY c.scheduled_at ASC
      `);
      return result.rows;
    } catch (error) {
      console.error('Error in getScheduledForSending:', error);
      throw error;
    }
  }
};

module.exports = CommunicationModel;