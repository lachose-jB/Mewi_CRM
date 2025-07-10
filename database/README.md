# CRM Recouvrement Database

This directory contains the database configuration, models, and services for the CRM Recouvrement application.

## Setup

The application uses SQLite for local development, which is a file-based database that doesn't require a separate server.

### Initial Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Set up the database:
   ```
   npm run db:setup
   ```

3. Seed the database with initial data:
   ```
   npm run db:seed
   ```

## Database Structure

The database consists of the following tables:

- `users`: Authentication information
- `profiles`: User profile information
- `clients`: Client information
- `invoices`: Invoice records
- `payments`: Payment records
- `communications`: Communication history (emails, SMS, calls, etc.)
- `documents`: Document storage metadata
- `relance_templates`: Templates for automated communications
- `relance_rules`: Rules for triggering automated actions
- `system_logs`: System activity logs

## Models

The application uses a model-based approach to interact with the database. Each model provides methods for CRUD operations on its respective table.

- `UserModel`: User management
- `ClientModel`: Client management
- `InvoiceModel`: Invoice management
- `PaymentModel`: Payment management
- `CommunicationModel`: Communication management
- `RelanceTemplateModel`: Template management
- `RelanceRuleModel`: Rule management

## Services

Services provide higher-level business logic by combining operations from multiple models.

- `authService`: Authentication and user management
- `clientService`: Client management and related operations
- `invoiceService`: Invoice management and payment processing
- `relanceService`: Automated relance processing
- `reportService`: Reporting and analytics

## Configuration

Database configuration is stored in the `.env` file at the root of the project. For local development, the default SQLite database file is stored in the `database/data` directory.

## Migration to Production

For production deployment, you can migrate to a more robust database like PostgreSQL by:

1. Updating the database configuration in `.env`
2. Modifying the connection logic in `database/db.js`
3. Running the schema creation script against your PostgreSQL database

The models and services are designed to be database-agnostic, so they should work with minimal changes regardless of the underlying database system.