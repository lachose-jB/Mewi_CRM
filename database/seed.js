import mysql from 'mysql2/promise';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Charger les variables d'environnement
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fonction pour générer un UUID
const uuid = () => randomUUID();

// Fonction pour hacher un mot de passe
const hashPassword = (password) => bcrypt.hashSync(password, 10);

// Fonction pour insérer les données de test
async function seedDatabase() {
  try {
    // Configuration de la base de données
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Mewi2025!',
      database: process.env.DB_NAME || 'mewidb'
    };

    // Créer une connexion
    const connection = await mysql.createConnection(dbConfig);
    
    console.log('Seeding database...');

    // Commencer une transaction
    await connection.query('START TRANSACTION');

    try {
      // Insérer un utilisateur administrateur
      const adminId = uuid();
      await connection.query(`
        INSERT INTO users (id, email, password_hash, created_at)
        VALUES (?, ?, ?, NOW())
      `, [adminId, 'admin@crm.com', hashPassword('123456')]);

      await connection.query(`
        INSERT INTO profiles (id, email, full_name, role, created_at)
        VALUES (?, ?, ?, ?, NOW())
      `, [adminId, 'admin@crm.com', 'Admin Principal', 'admin']);

      // Insérer un utilisateur gestionnaire
      const managerId = uuid();
      await connection.query(`
        INSERT INTO users (id, email, password_hash, created_at)
        VALUES (?, ?, ?, NOW())
      `, [managerId, 'gestionnaire@crm.com', hashPassword('123456')]);

      await connection.query(`
        INSERT INTO profiles (id, email, full_name, role, created_at)
        VALUES (?, ?, ?, ?, NOW())
      `, [managerId, 'gestionnaire@crm.com', 'Marie Dubois', 'manager']);

      // Insérer un utilisateur client
      const clientUserId = uuid();
      await connection.query(`
        INSERT INTO users (id, email, password_hash, created_at)
        VALUES (?, ?, ?, NOW())
      `, [clientUserId, 'client@example.com', hashPassword('123456')]);

      await connection.query(`
        INSERT INTO profiles (id, email, full_name, role, created_at)
        VALUES (?, ?, ?, ?, NOW())
      `, [clientUserId, 'client@example.com', 'Jean Martin', 'client']);

      // Insérer un utilisateur débiteur
      const debiteurUserId = uuid();
      await connection.query(`
        INSERT INTO users (id, email, password_hash, created_at)
        VALUES (?, ?, ?, NOW())
      `, [debiteurUserId, 'debiteur@example.com', hashPassword('123456')]);

      await connection.query(`
        INSERT INTO profiles (id, email, full_name, role, created_at)
        VALUES (?, ?, ?, ?, NOW())
      `, [debiteurUserId, 'debiteur@example.com', 'Pierre Dubois', 'debiteur']);

      // Insérer un client
      const clientId = uuid();
      await connection.query(`
        INSERT INTO clients (
          id, user_id, name, email, phone, address, company, manager_id, status, 
          total_amount, notes, created_at, last_contact
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), DATE_SUB(NOW(), INTERVAL 5 DAY))
      `, [
        clientId, 
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
      ]);

      // Insérer un débiteur
      const debiteurId = uuid();
      await connection.query(`
        INSERT INTO debiteurs (
          id, user_id, client_id, name, email, phone, address, company, manager_id, 
          status, recovery_status, total_amount, original_amount, paid_amount, 
          notes, created_at, updated_at, priority, risk_level, type
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, ?)
      `, [
        debiteurId,
        debiteurUserId,
        clientId,
        'Pierre Dubois',
        'pierre.dubois@example.com',
        '+33 6 12 34 56 78',
        '789 Boulevard Saint-Michel, 75006 Paris',
        'Dubois & Fils',
        managerId,
        'inProgress',
        'orange',
        12300.00,
        15000.00,
        2700.00,
        JSON.stringify(['Dossier transmis au service juridique', 'Contestation de facture']),
        'high',
        'high',
        'company'
      ]);

      // Insérer des factures
      const invoiceId1 = uuid();
      await connection.query(`
        INSERT INTO invoices (
          id, client_id, debiteur_id, invoice_number, amount, original_amount, paid_amount,
          due_date, issue_date, status, description, category, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, DATE_SUB(NOW(), INTERVAL 30 DAY), DATE_SUB(NOW(), INTERVAL 60 DAY), ?, ?, ?, NOW())
      `, [
        invoiceId1,
        clientId,
        debiteurId,
        'FAC-2024-001',
        8750.50,
        8750.50,
        0,
        'overdue',
        'Prestations de conseil - Novembre 2024',
        'Conseil'
      ]);

      const invoiceId2 = uuid();
      await connection.query(`
        INSERT INTO invoices (
          id, client_id, debiteur_id, invoice_number, amount, original_amount, paid_amount,
          due_date, issue_date, status, description, category, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, DATE_SUB(NOW(), INTERVAL 14 DAY), DATE_SUB(NOW(), INTERVAL 44 DAY), ?, ?, ?, NOW())
      `, [
        invoiceId2,
        clientId,
        debiteurId,
        'FAC-2024-002',
        4500.00,
        7000.00,
        2500.00,
        'partial',
        'Services de maintenance - Décembre 2024',
        'Maintenance'
      ]);

      // Insérer un paiement
      const paymentId = uuid();
      await connection.query(`
        INSERT INTO payments (
          id, client_id, debiteur_id, invoice_id, amount, payment_date, method, reference,
          status, notes, created_at
        )
        VALUES (?, ?, ?, ?, ?, DATE_SUB(NOW(), INTERVAL 5 DAY), ?, ?, ?, ?, NOW())
      `, [
        paymentId,
        clientId,
        debiteurId,
        invoiceId2,
        2500.00,
        'Virement bancaire',
        'VIR-20241210-001',
        'completed',
        'Paiement partiel reçu'
      ]);

      // Insérer une communication
      const commId = uuid();
      await connection.query(`
        INSERT INTO communications (
          id, client_id, debiteur_id, user_id, type, subject, content, status,
          sent_at, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, DATE_SUB(NOW(), INTERVAL 2 DAY), NOW())
      `, [
        commId,
        clientId,
        debiteurId,
        managerId,
        'email',
        'Rappel de paiement urgent',
        'Bonjour Pierre Dubois, nous vous rappelons que votre facture FAC-2024-001 est en retard de paiement...',
        'delivered'
      ]);

      // Insérer un modèle de relance
      const templateId = uuid();
      await connection.query(`
        INSERT INTO relance_templates (
          id, name, type, subject, content, variables, is_active,
          created_at, created_by
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)
      `, [
        templateId,
        'Email de relance standard',
        'email',
        'Rappel de paiement - Facture {{invoice_number}}',
        'Bonjour {{client_name}},\n\nNous vous rappelons que votre facture {{invoice_number}} d\'un montant de {{amount}} est échue depuis {{days_overdue}} jours.\n\nMerci de procéder au règlement dans les plus brefs délais.\n\nCordialement,\nL\'équipe de recouvrement',
        JSON.stringify(['client_name', 'invoice_number', 'amount', 'days_overdue']),
        true,
        adminId
      ]);

      // Insérer une règle de relance
      const ruleId = uuid();
      await connection.query(`
        INSERT INTO relance_rules (
          id, name, trigger_days, action, template_id, is_active,
          created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, NOW())
      `, [
        ruleId,
        'Première relance automatique',
        7,
        'email',
        templateId,
        true
      ]);

      // Valider la transaction
      await connection.query('COMMIT');
      console.log('Database seeded successfully!');
    } catch (error) {
      // Annuler la transaction en cas d'erreur
      await connection.query('ROLLBACK');
      console.error('Error seeding database:', error);
      throw error;
    } finally {
      // Fermer la connexion
      await connection.end();
    }
  } catch (error) {
    console.error('Database connection error:', error);
  }
}

// Exécuter le seeding
seedDatabase();