// Relance Rule Model
const db = require('../connection');

const RelanceRuleModel = {
  // Get all rules
  getAll: async () => {
    try {
      const result = await db.query(`
        SELECT r.*, t.name as template_name
        FROM relance_rules r
        LEFT JOIN relance_templates t ON r.template_id = t.id
        ORDER BY r.trigger_days ASC
      `);
      return result.rows;
    } catch (error) {
      console.error('Error in getAll rules:', error);
      throw error;
    }
  },

  // Get active rules
  getActive: async () => {
    try {
      const result = await db.query(`
        SELECT r.*, t.name as template_name
        FROM relance_rules r
        LEFT JOIN relance_templates t ON r.template_id = t.id
        WHERE r.is_active = true
        ORDER BY r.trigger_days ASC
      `);
      return result.rows;
    } catch (error) {
      console.error('Error in getActive rules:', error);
      throw error;
    }
  },

  // Get rules by action type
  getByAction: async (action) => {
    try {
      const result = await db.query(`
        SELECT r.*, t.name as template_name
        FROM relance_rules r
        LEFT JOIN relance_templates t ON r.template_id = t.id
        WHERE r.action = $1
        ORDER BY r.trigger_days ASC
      `, [action]);
      return result.rows;
    } catch (error) {
      console.error('Error in getByAction rules:', error);
      throw error;
    }
  },

  // Get rule by ID
  getById: async (id) => {
    try {
      const result = await db.query(`
        SELECT r.*, t.name as template_name
        FROM relance_rules r
        LEFT JOIN relance_templates t ON r.template_id = t.id
        WHERE r.id = $1
      `, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error in getById rule:', error);
      throw error;
    }
  },

  // Create a new rule
  create: async (ruleData) => {
    const { 
      name, 
      trigger_days, 
      action, 
      template_id, 
      new_status
    } = ruleData;
    
    try {
      const result = await db.query(
        `INSERT INTO relance_rules 
          (name, trigger_days, action, template_id, new_status) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [name, trigger_days, action, template_id, new_status]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in create rule:', error);
      throw error;
    }
  },

  // Update a rule
  update: async (id, ruleData) => {
    const { 
      name, 
      trigger_days, 
      action, 
      template_id, 
      new_status,
      is_active
    } = ruleData;
    
    try {
      const result = await db.query(
        `UPDATE relance_rules 
         SET name = $1, 
             trigger_days = $2, 
             action = $3, 
             template_id = $4, 
             new_status = $5,
             is_active = $6,
             updated_at = NOW() 
         WHERE id = $7 
         RETURNING *`,
        [name, trigger_days, action, template_id, new_status, is_active, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in update rule:', error);
      throw error;
    }
  },

  // Delete a rule
  delete: async (id) => {
    try {
      await db.query('DELETE FROM relance_rules WHERE id = $1', [id]);
      return true;
    } catch (error) {
      console.error('Error in delete rule:', error);
      throw error;
    }
  },

  // Get rules that should be triggered for a specific invoice
  getRulesForInvoice: async (invoice) => {
    try {
      const daysOverdue = Math.floor((new Date() - new Date(invoice.due_date)) / (1000 * 60 * 60 * 24));
      
      const result = await db.query(`
        SELECT r.*, t.name as template_name, t.type as template_type, t.subject, t.content
        FROM relance_rules r
        LEFT JOIN relance_templates t ON r.template_id = t.id
        WHERE r.is_active = true 
        AND r.trigger_days = $1
        ORDER BY r.trigger_days ASC
      `, [daysOverdue]);
      
      return result.rows;
    } catch (error) {
      console.error('Error in getRulesForInvoice:', error);
      throw error;
    }
  }
};

module.exports = RelanceRuleModel;