# Expense Reimbursement — Submission

## 1. Project Links

### GitHub Repository

https://github.com/gnikhil9984/Expense_Reimbursement

### Live Application

https://expense-reimbursement-frontend.onrender.com

### Backend API

https://expense-reimbursement-backend-8pgv.onrender.com

---

# 2. Project Overview

The Expense Reimbursement application is a full-stack web application
designed to manage employee expense reports and their approval workflow.

The application provides separate functionality for employees and approvers.

Employees can create and manage expense reports, add expense entries,
submit reports, and view their report information.

Approvers can review submitted reports and perform approval-related actions
according to their assigned reports and permissions.

The application uses a React frontend, Node.js/Express backend, and
PostgreSQL database hosted through Supabase.

---

# 3. Technology Stack

## Frontend

- React
- Vite
- JavaScript
- CSS

## Backend

- Node.js
- Express.js
- JavaScript
- REST APIs

## Database

- PostgreSQL
- Supabase

## Authentication

- JWT
- bcryptjs

## Deployment

- Render for backend
- Frontend deployed separately

## Version Control

- Git
- GitHub

---

# 4. User Roles

The application supports two primary roles.

## Employee

Employees can:

- Register and log in
- Create expense reports
- Edit reports
- Add expense lines
- Update expense lines
- Delete expense lines
- Submit reports
- View their reports
- View report details
- Manage applicable report actions

## Approver

Approvers can:

- Log in as an approver
- View reports available to them
- Review submitted reports
- Approve assigned submitted reports
- Reject assigned submitted reports
- Perform bulk approval/rejection operations where supported
- Export applicable report information

---

# 5. Self-Assessment Against Project Goals

## Goal 1 — Expense Report Management

**Status: Completed**

The application supports the main expense report workflow including report
creation, updating, submission, report details, and report management.

---

## Goal 2 — Expense Line Management

**Status: Completed**

Expense reports can contain multiple expense lines.

The application supports:

- Adding expense lines
- Updating expense lines
- Deleting expense lines
- Expense amount validation
- Expense category handling

---

## Goal 3 — Authentication and Authorization

**Status: Completed**

The application uses JWT-based authentication and supports employee and
approver roles.

Protected backend routes verify the authenticated user and role before
performing restricted operations.

---

## Goal 4 — Approval Workflow

**Status: Completed**

Submitted reports can be reviewed by authorized approvers.

The backend verifies the approver assignment and prevents an approver from
approving their own expense report.

Approval and rejection actions are protected by backend authorization checks.

---

## Goal 5 — Search and Filtering

**Status: Completed**

The report listing supports searching and filtering functionality.

The frontend communicates with the backend API to retrieve the relevant
report data.

---

## Goal 6 — Bulk Actions and Export

**Status: Completed**

The application supports bulk approval/rejection operations and CSV export
functionality.

Bulk requests validate report IDs before processing them.

---

## Goal 7 — Dashboard and Report Information

**Status: Completed / Implemented as applicable**

The application provides dashboard-based views for employees and approvers,
along with report information and status-related data.

---

## Goal 8 — Comments and Audit History

**Status: Implemented**

The database and backend support report comments and status history.

Status changes are recorded in the audit history.

The status history is protected against modification and deletion at the
database level.

---

## Goal 9 — Frontend Application

**Status: Completed**

A React + Vite frontend was created with separate screens and functionality
for employees and approvers.

The frontend communicates with the Express backend through REST APIs.

---

## Goal 10 — Deployment

**Status: Completed**

The backend was deployed to Render.

The frontend was configured to communicate with the deployed backend rather
than the local development server.

The production frontend build was successfully generated using Vite.

---

# 6. Backend Deployment

The backend is deployed using Render.

### Backend URL

https://expense-reimbursement-backend-8pgv.onrender.com

The Express server uses the hosting platform's `PORT` environment variable
and listens on `0.0.0.0` so that it can receive external requests.

Production secrets such as the database connection string and JWT secret are
configured through environment variables rather than committed to Git.

---

# 7. Database

The application uses PostgreSQL through Supabase.

The database contains the main entities required by the application,
including:

- Users
- Expense reports
- Expense lines
- Report approvers
- Status history
- Comments
- Alerts

Foreign keys and database constraints are used to maintain data integrity.

The status history is protected using a PostgreSQL trigger so that existing
audit records cannot be updated or deleted.

---

# 8. Authentication and Security

Authentication is implemented using JWT.

Passwords are hashed using `bcryptjs`.

Protected API requests include the JWT token using the Bearer authentication
scheme.

Backend authorization checks are used for role-sensitive operations.

The application also prevents an approver from approving their own expense
report.

Sensitive configuration values are stored through environment variables and
are not included in the repository.

---

# 9. Testing and Verification

The application was tested during development by running the backend and
frontend locally and manually checking the implemented functionality.

The following areas were verified:

- Authentication
- Employee functionality
- Approver functionality
- Expense report operations
- Expense line operations
- Approval workflow
- Rejection workflow
- Bulk operations
- CSV export
- Search/filter functionality
- Frontend/backend API communication
- Production frontend build
- Deployed backend connectivity

The frontend production build was successfully generated using:

```text
npm --prefix .\frontend run build