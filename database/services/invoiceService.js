import { invoiceModel, clientModel, paymentModel } from '../models/index.js';

export const invoiceService = {
  // Get all invoices
  getAllInvoices: async () => {
    return invoiceModel.getAll();
  },
  
  // Get invoices by client
  getInvoicesByClient: async (clientId) => {
    return invoiceModel.getByClient(clientId);
  },
  
  // Get overdue invoices
  getOverdueInvoices: async () => {
    return invoiceModel.getOverdue();
  },
  
  // Get invoice by ID with related data
  getInvoiceWithDetails: async (invoiceId) => {
    const invoice = invoiceModel.getById(invoiceId);
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    
    // Get related payments
    const payments = paymentModel.getByInvoice(invoiceId);
    
    return {
      ...invoice,
      payments
    };
  },
  
  // Create a new invoice
  createInvoice: async (invoiceData) => {
    // Verify client exists
    const client = clientModel.getById(invoiceData.client_id);
    if (!client) {
      throw new Error('Client not found');
    }
    
    // Create invoice
    const invoice = invoiceModel.create({
      ...invoiceData,
      original_amount: invoiceData.amount,
      paid_amount: 0,
      status: 'pending'
    });
    
    // Update client total amount
    clientModel.update(client.id, {
      total_amount: client.total_amount + invoiceData.amount
    });
    
    return invoice;
  },
  
  // Update an invoice
  updateInvoice: async (invoiceId, invoiceData) => {
    const invoice = invoiceModel.getById(invoiceId);
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    
    // Calculate amount difference
    const amountDifference = (invoiceData.amount || invoice.amount) - invoice.amount;
    
    // Update invoice
    const updatedInvoice = invoiceModel.update(invoiceId, invoiceData);
    
    // If amount changed, update client total amount
    if (amountDifference !== 0) {
      const client = clientModel.getById(invoice.client_id);
      clientModel.update(client.id, {
        total_amount: client.total_amount + amountDifference
      });
    }
    
    return updatedInvoice;
  },
  
  // Record a payment for an invoice
  recordPayment: async (invoiceId, paymentData) => {
    const invoice = invoiceModel.getById(invoiceId);
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    
    // Record payment in invoice
    const updatedInvoice = invoiceModel.recordPayment(invoiceId, paymentData.amount);
    
    // Create payment record
    const payment = paymentModel.create({
      ...paymentData,
      client_id: invoice.client_id,
      invoice_id: invoiceId,
      status: 'completed'
    });
    
    return {
      invoice: updatedInvoice,
      payment
    };
  },
  
  // Delete an invoice
  deleteInvoice: async (invoiceId) => {
    const invoice = invoiceModel.getById(invoiceId);
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    
    // Update client total amount
    const client = clientModel.getById(invoice.client_id);
    clientModel.update(client.id, {
      total_amount: client.total_amount - invoice.amount
    });
    
    // Delete invoice
    return invoiceModel.delete(invoiceId);
  }
};