# Architecture & Engineering Decisions

This document records the major technical and engineering decisions made
during the development and deployment of the Expense Reimbursement
application.

The purpose is to explain what was selected, why it was selected, and the
important trade-offs considered during implementation.

---

# Decision 1 — Use React + Vite for the Frontend

## Decision

Use React with Vite for the frontend application.

## Why

The application contains multiple interactive screens and role-based
workflows. React provides a component-based structure suitable for:

- Login
- Registration
- Employee dashboard
- Approver dashboard
- Expense report management
- Report details
- Approval and rejection actions
- Search and filtering
- Bulk actions
- CSV export

Vite provides a fast development and production build environment.

## Alternatives Considered

- Plain HTML/CSS/JavaScript
- Other frontend frameworks

## Trade-off

React introduces additional frontend tooling, but its component-based
architecture makes the application easier to organize and maintain.

---

# Decision 2 — Use Node.js + Express for the Backend

## Decision

Use Node.js with Express.js for the REST API backend.

## Why

The application requires:

- REST API endpoints
- Authentication
- Authorization
- Role-based access control
- Report management
- Approval and rejection workflows
- Validation
- Error handling
- Middleware

Express provides a simple structure for organizing routes, controllers,
middleware, and API responses.

## Alternatives Considered

- Node.js built-in HTTP module
- Other backend frameworks

## Trade-off

Express adds a framework dependency, but it significantly simplifies
backend API development and middleware management.

---

# Decision 3 — Use PostgreSQL Through Supabase

## Decision

Use PostgreSQL as the application's database and host it through Supabase.

## Why

The application contains strongly related data including:

- Users
- Expense reports
- Expense lines
- Report approvers
- Status history
- Comments
- Alerts

PostgreSQL provides:

- Foreign keys
- Constraints
- Indexes
- Relational integrity
- Transactions
- Persistent storage

Supabase provides managed PostgreSQL infrastructure suitable for the
deployed application.

## Alternatives Considered

- SQLite
- Other relational databases

## Trade-off

Managed PostgreSQL requires more configuration than a local SQLite database,
but it is more appropriate for a persistent deployed application.

---

# Decision 4 — Reversed Decision: SQLite → Supabase PostgreSQL

## Initial Decision

SQLite was considered during the early planning stage because it is simple
for local development and does not require a separate database server.

## Problem Identified

The project requires a deployed backend with persistent database storage.

A local SQLite database depends on the hosting environment's filesystem,
which is not an appropriate final architecture for this application.

## Revised Decision

The final database architecture uses Supabase PostgreSQL.

## Reason

Supabase provides persistent managed PostgreSQL infrastructure and allows
the backend to connect using a PostgreSQL connection URL.

## Final Architecture

```text
React + Vite Frontend
        |
        | HTTPS REST API
        v
Node.js + Express Backend
        |
        | PostgreSQL connection
        v
Supabase PostgreSQL