// Payment Model
const db = require('../connection');

const PaymentModel = {
  // Get all payments
  getAll: async () => {
    try {
      const result = await db.query(`
        SELECT p.*, c.name as client_name, i.invoice_number
        FROM payments p
        JOIN clients c ON p.client_id = c.id
        LEFT JOIN invoices i ON p.invoice_id = i.id
        ORDER BY p.payment_date DESC
      `);
      return result.rows;
    } catch (error) {
      console.error('Error in getAll payments:', error);
      throw error;
    }
  },

  // Get payments by client ID
  getByClient: async (clientId) => {
    try {
      const result = await db.query(`
        SELECT p.*, i.invoice_number
        FROM payments p
        LEFT JOIN invoices i ON p.invoice_id = i.id
        WHERE p.client_id = $1
        ORDER BY p.payment_date DESC
      `, [clientId]);
      return result.rows;
    } catch (error) {
      console.error('Error in getByClient payments:', error);
      throw error;
    }
  },

  // Get payments by invoice ID
  getByInvoice: async (invoiceId) => {
    try {
      const result = await db.query(`
        SELECT * FROM payments
        WHERE invoice_id = $1
        ORDER BY payment_date DESC
      `, [invoiceId]);
      return result.rows;
    } catch (error) {
      console.error('Error in getByInvoice payments:', error);
      throw error;
    }
  },

  // Get payment by ID
  getById: async (id) => {
    try {
      const result = await db.query(`
        SELECT p.*, c.name as client_name, i.invoice_number
        FROM payments p
        JOIN clients c ON p.client_id = c.id
        LEFT JOIN invoices i ON p.invoice_id = i.id
        WHERE p.id = $1
      `, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error in getById payment:', error);
      throw error;
    }
  },

  // Create a new payment
  create: async (paymentData) => {
    const { 
      client_id, 
      invoice_id, 
      amount, 
      payment_date, 
      method, 
      reference,
      notes
    } = paymentData;
    
    const client = await db.query('SELECT * FROM clients WHERE id = $1', [client_id]);
    if (!client.rows[0]) {
      throw new Error('Client not found');
    }
    
    try {
      // Start a transaction
      const client = await db.getClient();
      try {
        await client.query('BEGIN');
        
        // Create the payment record
        const paymentResult = await client.query(
          `INSERT INTO payments 
            (client_id, invoice_id, amount, payment_date, method, reference, notes, status) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, 'completed') 
           RETURNING *`,
          [client_id, invoice_id, amount, payment_date || 'NOW()', method, reference, notes]
        );
        
        // If this payment is for a specific invoice, update the invoice
        if (invoice_id) {
          const invoiceResult = await client.query('SELECT * FROM invoices WHERE id = $1', [invoice_id]);
          const invoice = invoiceResult.rows[0];
          
          if (invoice) {
            const newPaidAmount = (invoice.paid_amount || 0) + amount;
            const newAmount = invoice.amount - amount;
            let newStatus = invoice.status;
            
            if (newAmount <= 0) {
              newStatus = 'paid';
            } else if (newPaidAmount > 0) {
              newStatus = 'partial';
            }
            
            await client.query(
              `UPDATE invoices 
               SET amount = $1, 
                   paid_amount = $2,
                   status = $3,
                   updated_at = NOW() 
               WHERE id = $4`,
              [newAmount, newPaidAmount, newStatus, invoice_id]
            );
          }
        }
        
        // Update client total amount
        await client.query(
          `UPDATE clients 
           SET total_amount = total_amount - $1, 
               updated_at = NOW() 
           WHERE id = $2`,
          [amount, client_id]
        );
        
        await client.query('COMMIT');
        return paymentResult.rows[0];
      } catch (e) {
        await client.query('ROLLBACK');
        throw e;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error in create payment:', error);
      throw error;
    }
  },

  // Update a payment
  update: async (id, paymentData) => {
    const { 
      amount, 
      payment_date, 
      method, 
      reference,
      status,
      notes
    } = paymentData;
    
    try {
      // Get the current payment to calculate amount difference
      const currentPayment = await PaymentModel.getById(id);
      const amountDifference = amount - currentPayment.amount;
      
      // Start a transaction
      const client = await db.getClient();
      try {
        await client.query('BEGIN');
        
        // Update the payment
        const result = await client.query(
          `UPDATE payments 
           SET amount = $1, 
               payment_date = $2, 
               method = $3, 
               reference = $4,
               status = $5,
               notes = $6,
               updated_at = NOW() 
           WHERE id = $7 
           RETURNING *`,
          [amount, payment_date, method, reference, status, notes, id]
        );
        
        // If amount changed and this payment is for a specific invoice, update the invoice
        if (amountDifference !== 0 && currentPayment.invoice_id) {
          const invoiceResult = await client.query('SELECT * FROM invoices WHERE id = $1', [currentPayment.invoice_id]);
          const invoice = invoiceResult.rows[0];
          
          if (invoice) {
            const newPaidAmount = (invoice.paid_amount || 0) - currentPayment.amount + amount;
            const newAmount = invoice.amount + currentPayment.amount - amount;
            let newStatus = invoice.status;
            
            if (newAmount <= 0) {
              newStatus = 'paid';
            } else if (newPaidAmount > 0) {
              newStatus = 'partial';
            } else {
              newStatus = 'pending';
            }
            
            await client.query(
              `UPDATE invoices 
               SET amount = $1, 
                   paid_amount = $2,
                   status = $3,
                   updated_at = NOW() 
               WHERE id = $4`,
              [newAmount, newPaidAmount, newStatus, currentPayment.invoice_id]
            );
          }
        }
        
        // If amount changed, update client total amount
        if (amountDifference !== 0) {
          await client.query(
            `UPDATE clients 
             SET total_amount = total_amount - $1, 
                 updated_at = NOW() 
             WHERE id = $2`,
            [amountDifference, currentPayment.client_id]
          );
        }
        
        await client.query('COMMIT');
        return result.rows[0];
      } catch (e) {
        await client.query('ROLLBACK');
        throw e;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error in update payment:', error);
      throw error;
    }
  },

  // Delete a payment
  delete: async (id) => {
    try {
      // Get the payment first to update related records
      const payment = await PaymentModel.getById(id);
      
      if (!payment) {
        throw new Error('Payment not found');
      }
      
      // Start a transaction
      const client = await db.getClient();
      try {
        await client.query('BEGIN');
        
        // Delete the payment
        await client.query('DELETE FROM payments WHERE id = $1', [id]);
        
        // If this payment was for a specific invoice, update the invoice
        if (payment.invoice_id) {
          const invoiceResult = await client.query('SELECT * FROM invoices WHERE id = $1', [payment.invoice_id]);
          const invoice = invoiceResult.rows[0];
          
          if (invoice) {
            const newPaidAmount = (invoice.paid_amount || 0) - payment.amount;
            const newAmount = invoice.amount + payment.amount;
            let newStatus = invoice.status;
            
            if (newPaidAmount <= 0) {
              newStatus = 'pending';
            } else {
              newStatus = 'partial';
            }
            
            await client.query(
              `UPDATE invoices 
               SET amount = $1, 
                   paid_amount = $2,
                   status = $3,
                   updated_at = NOW() 
               WHERE id = $4`,
              [newAmount, newPaidAmount, newStatus, payment.invoice_id]
            );
          }
        }
        
        // Update client total amount
        await client.query(
          `UPDATE clients 
           SET total_amount = total_amount + $1, 
               updated_at = NOW() 
           WHERE id = $2`,
          [payment.amount, payment.client_id]
        );
        
        await client.query('COMMIT');
        return true;
      } catch (e) {
        await client.query('ROLLBACK');
        throw e;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error in delete payment:', error);
      throw error;
    }
  }
};

module.exports = PaymentModel;