import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import { hashSync } from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path
const dbPath = path.join(__dirname, 'data', 'crm.sqlite');

// Connect to the database
const db = new Database(dbPath);

console.log('Seeding database...');

// Helper function to generate UUID
const uuid = () => randomUUID();

// Hash password
const hashPassword = (password) => hashSync(password, 10);

// Begin transaction
db.prepare('BEGIN TRANSACTION').run();

try {
  // Insert admin user
  const adminId = uuid();
  db.prepare(`
    INSERT INTO users (id, email, password_hash, created_at)
    VALUES (?, ?, ?, datetime('now'))
  `).run(adminId, 'admin@crm.com', hashPassword('123456'));

  db.prepare(`
    INSERT INTO profiles (id, email, full_name, role, created_at)
    VALUES (?, ?, ?, ?, datetime('now'))
  `).run(adminId, 'admin@crm.com', 'Admin Principal', 'admin');

  // Insert manager user
  const managerId = uuid();
  db.prepare(`
    INSERT INTO users (id, email, password_hash, created_at)
    VALUES (?, ?, ?, datetime('now'))
  `).run(managerId, 'gestionnaire@crm.com', hashPassword('123456'));

  db.prepare(`
    INSERT INTO profiles (id, email, full_name, role, created_at)
    VALUES (?, ?, ?, ?, datetime('now'))
  `).run(managerId, 'gestionnaire@crm.com', 'Marie Dubois', 'manager');

  // Insert client user
  const clientUserId = uuid();
  db.prepare(`
    INSERT INTO users (id, email, password_hash, created_at)
    VALUES (?, ?, ?, datetime('now'))
  `).run(clientUserId, 'client@example.com', hashPassword('123456'));

  db.prepare(`
    INSERT INTO profiles (id, email, full_name, role, created_at)
    VALUES (?, ?, ?, ?, datetime('now'))
  `).run(clientUserId, 'client@example.com', 'Jean Martin', 'client');

  // Insert clients
  const clientId1 = uuid();
  db.prepare(`
    INSERT INTO clients (
      id, user_id, name, email, phone, address, company, manager_id, status, 
      total_amount, notes, created_at, last_contact
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now', '-5 days'))
  `).run(
    clientId1, 
    clientUserId, 
    'Jean Martin', 
    'jean.martin@example.com', 
    '+33 1 23 45 67 89', 
    '123 Rue de la Paix, 75001 Paris', 
    'Martin SARL', 
    managerId, 
    'critical', 
    15750.50, 
    JSON.stringify(['Client difficile à joindre', 'Promesse de règlement au 15/12'])
  );

  const clientId2 = uuid();
  db.prepare(`
    INSERT INTO clients (
      id, name, email, phone, address, company, manager_id, status, 
      total_amount, notes, created_at, last_contact
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now', '-2 days'))
  `).run(
    clientId2, 
    'Sophie Leroy', 
    'sophie.leroy@company.com', 
    '+33 1 98 76 54 32', 
    '456 Avenue des Champs, 69000 Lyon', 
    'Leroy & Associés', 
    managerId, 
    'orange', 
    8200.00, 
    JSON.stringify(['Bon payeur habituellement'])
  );

  // Insert invoices
  const invoiceId1 = uuid();
  db.prepare(`
    INSERT INTO invoices (
      id, client_id, invoice_number, amount, original_amount, paid_amount,
      due_date, issue_date, status, description, category, created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, date('now', '-30 days'), date('now', '-60 days'), ?, ?, ?, datetime('now'))
  `).run(
    invoiceId1,
    clientId1,
    'FAC-2024-001',
    8750.50,
    8750.50,
    0,
    'overdue',
    'Prestations de conseil - Novembre 2024',
    'Conseil'
  );

  const invoiceId2 = uuid();
  db.prepare(`
    INSERT INTO invoices (
      id, client_id, invoice_number, amount, original_amount, paid_amount,
      due_date, issue_date, status, description, category, created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, date('now', '-14 days'), date('now', '-44 days'), ?, ?, ?, datetime('now'))
  `).run(
    invoiceId2,
    clientId1,
    'FAC-2024-002',
    4500.00,
    7000.00,
    2500.00,
    'partial',
    'Services de maintenance - Décembre 2024',
    'Maintenance'
  );

  // Insert payments
  const paymentId = uuid();
  db.prepare(`
    INSERT INTO payments (
      id, client_id, invoice_id, amount, payment_date, method, reference,
      status, notes, created_at
    )
    VALUES (?, ?, ?, ?, datetime('now', '-5 days'), ?, ?, ?, ?, datetime('now'))
  `).run(
    paymentId,
    clientId1,
    invoiceId2,
    2500.00,
    'Virement bancaire',
    'VIR-20241210-001',
    'completed',
    'Paiement partiel reçu'
  );

  // Insert communications
  const commId1 = uuid();
  db.prepare(`
    INSERT INTO communications (
      id, client_id, user_id, type, subject, content, status,
      sent_at, created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now', '-2 days'), datetime('now'))
  `).run(
    commId1,
    clientId1,
    managerId,
    'email',
    'Rappel de paiement urgent',
    'Bonjour Jean Martin, nous vous rappelons que votre facture FAC-2024-001 est en retard de paiement...',
    'delivered'
  );

  // Insert templates
  const templateId = uuid();
  db.prepare(`
    INSERT INTO relance_templates (
      id, name, type, subject, content, variables, is_active,
      created_at, created_by
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), ?)
  `).run(
    templateId,
    'Email de relance standard',
    'email',
    'Rappel de paiement - Facture {{invoice_number}}',
    'Bonjour {{client_name}},\n\nNous vous rappelons que votre facture {{invoice_number}} d\'un montant de {{amount}} est échue depuis {{days_overdue}} jours.\n\nMerci de procéder au règlement dans les plus brefs délais.\n\nCordialement,\nL\'équipe de recouvrement',
    JSON.stringify(['client_name', 'invoice_number', 'amount', 'days_overdue']),
    true,
    adminId
  );

  // Insert rules
  const ruleId = uuid();
  db.prepare(`
    INSERT INTO relance_rules (
      id, name, trigger_days, action, template_id, is_active,
      created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
  `).run(
    ruleId,
    'Première relance automatique',
    7,
    'email',
    templateId,
    true
  );

  console.log('Database seeded successfully!');
  
  // Commit transaction
  db.prepare('COMMIT').run();
} catch (error) {
  // Rollback transaction on error
  db.prepare('ROLLBACK').run();
  console.error('Error seeding database:', error);
  throw error;
}