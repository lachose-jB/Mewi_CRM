import getDb from '../db.js';

// Helper function to generate UUID
const generateId = () => {
  return crypto.randomUUID();
};

// Base model with common CRUD operations
class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
    this.db = getDb();
  }

  getAll() {
    return this.db.prepare(`SELECT * FROM ${this.tableName} ORDER BY created_at DESC`).all();
  }

  getById(id) {
    return this.db.prepare(`SELECT * FROM ${this.tableName} WHERE id = ?`).get(id);
  }

  create(data) {
    const id = data.id || generateId();
    const columns = Object.keys(data).concat('id');
    const placeholders = columns.map(() => '?').join(', ');
    const values = columns.map(col => col === 'id' ? id : data[col]);
    
    const sql = `INSERT INTO ${this.tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
    const info = this.db.prepare(sql).run(...values);
    
    if (info.changes === 0) {
      throw new Error(`Failed to create record in ${this.tableName}`);
    }
    
    return this.getById(id);
  }

  update(id, data) {
    const columns = Object.keys(data);
    const setClause = columns.map(col => `${col} = ?`).join(', ');
    const values = [...columns.map(col => data[col]), id];
    
    const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;
    const info = this.db.prepare(sql).run(...values);
    
    if (info.changes === 0) {
      throw new Error(`Record with id ${id} not found in ${this.tableName}`);
    }
    
    return this.getById(id);
  }

  delete(id) {
    const info = this.db.prepare(`DELETE FROM ${this.tableName} WHERE id = ?`).run(id);
    return info.changes > 0;
  }
}

// User model
export class UserModel extends BaseModel {
  constructor() {
    super('users');
  }

  getByEmail(email) {
    return this.db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  }

  getWithProfile(id) {
    return this.db.prepare(`
      SELECT u.*, p.full_name, p.role, p.is_active, p.last_login
      FROM users u
      JOIN profiles p ON u.id = p.id
      WHERE u.id = ?
    `).get(id);
  }

  createWithProfile(userData, profileData) {
    const id = generateId();
    
    // Start transaction
    const transaction = this.db.transaction((userData, profileData) => {
      // Create user
      this.db.prepare(`
        INSERT INTO users (id, email, password_hash, created_at)
        VALUES (?, ?, ?, datetime('now'))
      `).run(id, userData.email, userData.password_hash);
      
      // Create profile
      this.db.prepare(`
        INSERT INTO profiles (id, email, full_name, role, created_at)
        VALUES (?, ?, ?, ?, datetime('now'))
      `).run(id, userData.email, profileData.full_name, profileData.role);
      
      return id;
    });
    
    // Execute transaction
    transaction(userData, profileData);
    
    return this.getWithProfile(id);
  }
}

// Client model
export class ClientModel extends BaseModel {
  constructor() {
    super('clients');
  }

  getByManager(managerId) {
    return this.db.prepare(`
      SELECT c.*, p.full_name as manager_name 
      FROM clients c
      LEFT JOIN profiles p ON c.manager_id = p.id
      WHERE c.manager_id = ?
      ORDER BY c.created_at DESC
    `).all(managerId);
  }

  getByUserId(userId) {
    return this.db.prepare(`
      SELECT c.*, p.full_name as manager_name 
      FROM clients c
      LEFT JOIN profiles p ON c.manager_id = p.id
      WHERE c.user_id = ?
    `).get(userId);
  }

  updateStatus(id, status) {
    const info = this.db.prepare(`
      UPDATE clients 
      SET status = ?, updated_at = datetime('now') 
      WHERE id = ?
    `).run(status, id);
    
    if (info.changes === 0) {
      throw new Error(`Client with id ${id} not found`);
    }
    
    return this.getById(id);
  }
}

// Invoice model
export class InvoiceModel extends BaseModel {
  constructor() {
    super('invoices');
  }

  getByClient(clientId) {
    return this.db.prepare(`
      SELECT * FROM invoices
      WHERE client_id = ?
      ORDER BY due_date ASC
    `).all(clientId);
  }

  getOverdue() {
    return this.db.prepare(`
      SELECT i.*, c.name as client_name, c.email as client_email
      FROM invoices i
      JOIN clients c ON i.client_id = c.id
      WHERE i.due_date < date('now') AND i.status != 'paid'
      ORDER BY i.due_date ASC
    `).all();
  }

  recordPayment(id, paymentAmount) {
    const invoice = this.getById(id);
    
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
    
    // Start transaction
    const transaction = this.db.transaction((id, newAmount, newPaidAmount, newStatus, clientId, paymentAmount) => {
      // Update invoice
      this.db.prepare(`
        UPDATE invoices 
        SET amount = ?, 
            paid_amount = ?,
            status = ?,
            updated_at = datetime('now') 
        WHERE id = ?
      `).run(newAmount, newPaidAmount, newStatus, id);
      
      // Update client total amount
      this.db.prepare(`
        UPDATE clients 
        SET total_amount = total_amount - ?, 
            updated_at = datetime('now') 
        WHERE id = ?
      `).run(paymentAmount, clientId);
    });
    
    // Execute transaction
    transaction(id, newAmount, newPaidAmount, newStatus, invoice.client_id, paymentAmount);
    
    return this.getById(id);
  }
}

// Payment model
export class PaymentModel extends BaseModel {
  constructor() {
    super('payments');
  }

  getByClient(clientId) {
    return this.db.prepare(`
      SELECT p.*, i.invoice_number
      FROM payments p
      LEFT JOIN invoices i ON p.invoice_id = i.id
      WHERE p.client_id = ?
      ORDER BY p.payment_date DESC
    `).all(clientId);
  }

  getByInvoice(invoiceId) {
    return this.db.prepare(`
      SELECT * FROM payments
      WHERE invoice_id = ?
      ORDER BY payment_date DESC
    `).all(invoiceId);
  }
}

// Communication model
export class CommunicationModel extends BaseModel {
  constructor() {
    super('communications');
  }

  getByClient(clientId) {
    return this.db.prepare(`
      SELECT c.*, p.full_name as user_name
      FROM communications c
      LEFT JOIN profiles p ON c.user_id = p.id
      WHERE c.client_id = ?
      ORDER BY c.created_at DESC
    `).all(clientId);
  }

  getByUser(userId) {
    return this.db.prepare(`
      SELECT c.*, cl.name as client_name
      FROM communications c
      JOIN clients cl ON c.client_id = cl.id
      WHERE c.user_id = ?
      ORDER BY c.created_at DESC
    `).all(userId);
  }

  updateStatus(id, status) {
    const info = this.db.prepare(`
      UPDATE communications 
      SET status = ?,
          ${status === 'sent' ? 'sent_at = datetime(\'now\'),' : ''}
          updated_at = datetime('now')
      WHERE id = ?
    `).run(status, id);
    
    if (info.changes === 0) {
      throw new Error(`Communication with id ${id} not found`);
    }
    
    return this.getById(id);
  }
}

// RelanceTemplate model
export class RelanceTemplateModel extends BaseModel {
  constructor() {
    super('relance_templates');
  }

  getByType(type) {
    return this.db.prepare(`
      SELECT t.*, p.full_name as created_by_name
      FROM relance_templates t
      LEFT JOIN profiles p ON t.created_by = p.id
      WHERE t.type = ?
      ORDER BY t.name ASC
    `).all(type);
  }

  getActive() {
    return this.db.prepare(`
      SELECT t.*, p.full_name as created_by_name
      FROM relance_templates t
      LEFT JOIN profiles p ON t.created_by = p.id
      WHERE t.is_active = 1
      ORDER BY t.name ASC
    `).all();
  }
}

// RelanceRule model
export class RelanceRuleModel extends BaseModel {
  constructor() {
    super('relance_rules');
  }

  getActive() {
    return this.db.prepare(`
      SELECT r.*, t.name as template_name
      FROM relance_rules r
      LEFT JOIN relance_templates t ON r.template_id = t.id
      WHERE r.is_active = 1
      ORDER BY r.trigger_days ASC
    `).all();
  }

  getByAction(action) {
    return this.db.prepare(`
      SELECT r.*, t.name as template_name
      FROM relance_rules r
      LEFT JOIN relance_templates t ON r.template_id = t.id
      WHERE r.action = ?
      ORDER BY r.trigger_days ASC
    `).all(action);
  }
}

// Create model instances
export const userModel = new UserModel();
export const clientModel = new ClientModel();
export const invoiceModel = new InvoiceModel();
export const paymentModel = new PaymentModel();
export const communicationModel = new CommunicationModel();
export const relanceTemplateModel = new RelanceTemplateModel();
export const relanceRuleModel = new RelanceRuleModel();