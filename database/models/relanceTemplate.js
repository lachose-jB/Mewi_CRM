// Relance Template Model
const db = require('../connection');

const RelanceTemplateModel = {
  // Get all templates
  getAll: async () => {
    try {
      const result = await db.query(`
        SELECT t.*, p.name as created_by_name
        FROM relance_templates t
        LEFT JOIN profiles p ON t.created_by = p.id
        ORDER BY t.name ASC
      `);
      return result.rows;
    } catch (error) {
      console.error('Error in getAll templates:', error);
      throw error;
    }
  },

  // Get templates by type
  getByType: async (type) => {
    try {
      const result = await db.query(`
        SELECT t.*, p.name as created_by_name
        FROM relance_templates t
        LEFT JOIN profiles p ON t.created_by = p.id
        WHERE t.type = $1
        ORDER BY t.name ASC
      `, [type]);
      return result.rows;
    } catch (error) {
      console.error('Error in getByType templates:', error);
      throw error;
    }
  },

  // Get active templates
  getActive: async () => {
    try {
      const result = await db.query(`
        SELECT t.*, p.name as created_by_name
        FROM relance_templates t
        LEFT JOIN profiles p ON t.created_by = p.id
        WHERE t.is_active = true
        ORDER BY t.name ASC
      `);
      return result.rows;
    } catch (error) {
      console.error('Error in getActive templates:', error);
      throw error;
    }
  },

  // Get template by ID
  getById: async (id) => {
    try {
      const result = await db.query(`
        SELECT t.*, p.name as created_by_name
        FROM relance_templates t
        LEFT JOIN profiles p ON t.created_by = p.id
        WHERE t.id = $1
      `, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error in getById template:', error);
      throw error;
    }
  },

  // Create a new template
  create: async (templateData) => {
    const { 
      name, 
      type, 
      subject, 
      content, 
      variables,
      created_by
    } = templateData;
    
    try {
      const result = await db.query(
        `INSERT INTO relance_templates 
          (name, type, subject, content, variables, created_by) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING *`,
        [name, type, subject, content, variables, created_by]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in create template:', error);
      throw error;
    }
  },

  // Update a template
  update: async (id, templateData) => {
    const { 
      name, 
      type, 
      subject, 
      content, 
      variables,
      is_active
    } = templateData;
    
    try {
      const result = await db.query(
        `UPDATE relance_templates 
         SET name = $1, 
             type = $2, 
             subject = $3, 
             content = $4, 
             variables = $5,
             is_active = $6,
             updated_at = NOW() 
         WHERE id = $7 
         RETURNING *`,
        [name, type, subject, content, variables, is_active, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in update template:', error);
      throw error;
    }
  },

  // Delete a template
  delete: async (id) => {
    try {
      // Check if template is used in any rules
      const rulesCheck = await db.query(
        'SELECT COUNT(*) FROM relance_rules WHERE template_id = $1',
        [id]
      );
      
      if (parseInt(rulesCheck.rows[0].count) > 0) {
        throw new Error('Cannot delete template that is used in active rules');
      }
      
      await db.query('DELETE FROM relance_templates WHERE id = $1', [id]);
      return true;
    } catch (error) {
      console.error('Error in delete template:', error);
      throw error;
    }
  }
};

module.exports = RelanceTemplateModel;