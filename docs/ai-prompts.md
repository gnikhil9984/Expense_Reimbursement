# AI Prompts & Development Notes

This document describes how AI assistance was used during the development of
the Expense Reimbursement application.

AI was used as a development assistant at different stages of the project.
The prompts were generally focused on one problem at a time — understanding
requirements, designing the database, implementing backend functionality,
building the frontend, debugging issues, and preparing the application for
deployment.

The responses were reviewed and tested during development before the changes
were kept in the project.

---

# 1. Understanding the Project Requirements

## Prompt

> Read the Expense Reimbursement application requirements and explain what
> needs to be built. Break the requirements into logical development phases
> so that the project can be implemented and tested step by step.

## Why This Prompt Was Used

Before writing code, the project requirements needed to be converted into
smaller and manageable tasks.

## Result

The requirements were organized around the major areas of the application:

- Project setup
- Backend foundation
- Database
- Authentication and authorization
- Expense reports
- Approval workflow
- Search and filtering
- Bulk actions
- CSV export
- Dashboard
- Comments and status history
- Frontend
- Testing
- Deployment
- Documentation

This gave the project a clear development sequence.

---

# 2. Planning the Backend Structure

## Prompt

> Suggest a simple Node.js and Express backend structure for this expense
> reimbursement application. Separate routes, controllers, middleware,
> database connection, authentication, and error handling without making
> the project unnecessarily complex.

## Result

The backend was organized into separate responsibilities:

- Routes
- Controllers
- Middleware
- Database connection
- Authentication
- Error handling

This made it easier to locate and modify functionality as new features
were implemented.

---

# 3. Designing the Database

## Prompt

> Design a normalized PostgreSQL schema for an expense reimbursement system.
> The application needs users, expense reports, expense lines, approver
> assignments, status history, comments, and alerts. Include relationships,
> foreign keys, constraints, and useful indexes.

## Result

The database was structured around the following tables:

- `users`
- `expense_reports`
- `expense_lines`
- `report_approvers`
- `status_history`
- `comments`
- `alerts`

The design also included relationships between the tables and database-level
constraints for important data validation.

---

# 4. Protecting Status History

## Prompt

> The expense report needs an audit trail. How can PostgreSQL be used to
> prevent existing status history records from being modified or deleted
> after they are created?

## Result

A PostgreSQL trigger was used for the `status_history` table.

The trigger prevents:

- Updating existing history records
- Deleting existing history records

This keeps previously recorded status changes immutable.

---

# 5. Connecting PostgreSQL to the Backend

## Prompt

> Show how to connect an Express application to PostgreSQL using the `pg`
> package and an environment variable such as DATABASE_URL. Keep database
> credentials outside the source code.

## Result

A PostgreSQL connection pool was configured in the backend.

The database connection uses:

```text
DATABASE_URL