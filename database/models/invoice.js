// Invoice Model
const db = require('../connection');

const InvoiceModel = {
  // Get all invoices
  getAll: async () => {
    try {
      const result = await db.query(`
        SELECT i.*, c.name as client_name 
        FROM invoices i
        JOIN clients c ON i.client_id = c.id
        ORDER BY i.due_date ASC
      `);
      return result.rows;
    } catch (error) {
      console.error('Error in getAll invoices:', error);
      throw error;
    }
  },

  // Get invoices by client ID
  getByClient: async (clientId) => {
    try {
      const result = await db.query(`
        SELECT * FROM invoices
        WHERE client_id = $1
        ORDER BY due_date ASC
      `, [clientId]);
      return result.rows;
    } catch (error) {
      console.error('Error in getByClient invoices:', error);
      throw error;
    }
  },

  // Get overdue invoices
  getOverdue: async () => {
    try {
      const result = await db.query(`
        SELECT i.*, c.name as client_name, c.email as client_email
        FROM invoices i
        JOIN clients c ON i.client_id = c.id
        WHERE i.due_date < CURRENT_DATE AND i.status != 'paid'
        ORDER BY i.due_date ASC
      `);
      return result.rows;
    } catch (error) {
      console.error('Error in getOverdue invoices:', error);
      throw error;
    }
  },

  // Get invoice by ID
  getById: async (id) => {
    try {
      const result = await db.query(`
        SELECT i.*, c.name as client_name, c.email as client_email
        FROM invoices i
        JOIN clients c ON i.client_id = c.id
        WHERE i.id = $1
      `, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error in getById invoice:', error);
      throw error;
    }
  },

  // Create a new invoice
  create: async (invoiceData) => {
    const { 
      client_id, 
      invoice_number, 
      amount, 
      original_amount,
      due_date, 
      issue_date, 
      description,
      category
    } = invoiceData;
    
    try {
      const result = await db.query(
        `INSERT INTO invoices 
          (client_id, invoice_number, amount, original_amount, due_date, issue_date, description, category, status) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending') 
         RETURNING *`,
        [client_id, invoice_number, amount, original_amount, due_date, issue_date, description, category]
      );
      
      // Update client total amount
      await db.query(
        `UPDATE clients 
         SET total_amount = total_amount + $1, 
             updated_at = NOW() 
         WHERE id = $2`,
        [amount, client_id]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Error in create invoice:', error);
      throw error;
    }
  },

  // Update an invoice
  update: async (id, invoiceData) => {
    const { 
      amount, 
      paid_amount,
      due_date, 
      status,
      description
    } = invoiceData;
    
    try {
      // Get the current invoice to calculate amount difference
      const currentInvoice = await InvoiceModel.getById(id);
      const amountDifference = amount - currentInvoice.amount;
      
      const result = await db.query(
        `UPDATE invoices 
         SET amount = $1, 
             paid_amount = $2,
             due_date = $3, 
             status = $4, 
             description = $5,
             updated_at = NOW() 
         WHERE id = $6 
         RETURNING *`,
        [amount, paid_amount, due_date, status, description, id]
      );
      
      // Update client total amount if there's a difference
      if (amountDifference !== 0) {
        await db.query(
          `UPDATE clients 
           SET total_amount = total_amount + $1, 
               updated_at = NOW() 
           WHERE id = $2`,
          [amountDifference, currentInvoice.client_id]
        );
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Error in update invoice:', error);
      throw error;
    }
  },

  // Record a payment
  recordPayment: async (id, paymentAmount) => {
    try {
      const invoice = await InvoiceModel.getById(id);
      
      if (!invoice) {
        throw new Error('Invoice not found');
      }
      
      const newPaidAmount = (invoice.paid_amount || 0) + paymentAmount;
      const newAmount = invoice.amount - paymentAmount;
      let newStatus = invoice.status;
      
      if (newAmount <= 0) {
        newStatus = 'paid';
      } else if (newPaidAmount > 0) {
        newStatus = 'partial';
      }
      
      const result = await db.query(
        `UPDATE invoices 
         SET amount = $1, 
             paid_amount = $2,
             status = $3,
             updated_at = NOW() 
         WHERE id = $4 
         RETURNING *`,
        [newAmount, newPaidAmount, newStatus, id]
      );
      
      // Update client total amount
      await db.query(
        `UPDATE clients 
         SET total_amount = total_amount - $1, 
             updated_at = NOW() 
         WHERE id = $2`,
        [paymentAmount, invoice.client_id]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Error in recordPayment:', error);
      throw error;
    }
  },

  // Delete an invoice
  delete: async (id) => {
    try {
      // Get the invoice first to update client total amount
      const invoice = await InvoiceModel.getById(id);
      
      if (!invoice) {
        throw new Error('Invoice not found');
      }
      
      await db.query('DELETE FROM invoices WHERE id = $1', [id]);
      
      // Update client total amount
      await db.query(
        `UPDATE clients 
         SET total_amount = total_amount - $1, 
             updated_at = NOW() 
         WHERE id = $2`,
        [invoice.amount, invoice.client_id]
      );
      
      return true;
    } catch (error) {
      console.error('Error in delete invoice:', error);
      throw error;
    }
  }
};

module.exports = InvoiceModel;