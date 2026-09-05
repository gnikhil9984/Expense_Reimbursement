# Expense Reimbursement Management System

A full-stack Expense Reimbursement Management System built to manage employee expense reports, expense entries, submission, approval, rejection, bulk operations, audit history, search/filtering, CSV export, and role-based access.

The application uses a React frontend, Node.js/Express backend, and PostgreSQL database hosted through Supabase. The backend is deployed on Render and the frontend is deployed separately.

---

# 1. Project Overview

Expense reimbursement is a common business workflow where employees submit expenses and authorized approvers review those expenses before reimbursement.

This project provides a web-based system for managing that workflow.

The application supports two main user roles:

- Employee
- Approver

### Employee

An employee can:

- Register an account
- Login securely
- Create expense reports
- Edit draft reports
- Add expense lines
- Edit expense lines
- Delete expense lines
- Submit reports for approval
- View their reports
- View report details
- Archive reports
- Restore archived reports
- Search and filter reports
- Add comments where supported

### Approver

An approver can:

- Login securely
- View reports assigned to them
- Review submitted reports
- Approve reports
- Reject reports
- Provide rejection information where required
- Perform bulk approval/rejection operations
- Search and filter reports
- Export eligible report information as CSV

---

# 2. Project Goals

The project was developed around the following major goals:

1. Build a complete expense report management system.
2. Provide secure employee and approver authentication.
3. Implement role-based authorization.
4. Support the expense report lifecycle.
5. Provide an approval and rejection workflow.
6. Provide search, filtering, and pagination.
7. Support bulk approval/rejection and CSV export.
8. Maintain status history and audit information.
9. Provide a React-based user interface.
10. Deploy the application using production hosting services.

The implementation was completed incrementally and tested during development.

---

# 3. Main Features

## Authentication

The application provides:

- User registration
- User login
- Password hashing
- JWT-based authentication
- Authentication middleware
- Role-based authorization
- Protected routes
- Employee/approver role separation

Passwords are never stored as plain text.

---

# 4. Role-Based Access

The system separates functionality based on the user's role.

```text
                 ┌─────────────────────┐
                 │       User           │
                 └──────────┬──────────┘
                            │
                    ┌───────┴───────┐
                    │               │
                    ▼               ▼
              Employee          Approver
                    │               │
                    ▼               ▼
             Expense Reports    Approval Queue