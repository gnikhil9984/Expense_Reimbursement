# Architecture & Engineering Decisions

This document records important technical decisions made during the
development of the Expense Reimbursement application.

The purpose is to explain not only what was selected, but also why the
decision was made and what trade-offs were considered.

---

# Decision 1 — Use React + Vite for the Frontend

## Decision

Use React with Vite for the frontend application.

## Why

React provides a component-based approach that is suitable for building
multiple screens such as:

- Login
- Employee dashboard
- Approver dashboard
- Expense report forms
- Approval queues
- Report details
- Dashboard analytics

Vite provides a simple and fast development environment for React.

## Alternatives Considered

- Plain HTML/CSS/JavaScript
- Other frontend frameworks

## Trade-off

React introduces additional tooling compared with plain HTML/CSS/JavaScript,
but the component architecture is more suitable for this application's
multiple interactive screens.

---

# Decision 2 — Use Node.js + Express for the Backend

## Decision

Use Node.js with Express.js for the REST API.

## Why

The application requires multiple API endpoints, middleware, authentication,
authorization, validation, and error handling.

Express provides a simple structure for:

- Routes
- Controllers
- Middleware
- Error handling
- REST APIs

## Alternatives Considered

- Node.js built-in HTTP module
- Other backend frameworks

## Trade-off

Express adds a framework dependency, but it significantly simplifies API
development and middleware management.

---

# Decision 3 — Use PostgreSQL through Supabase

## Decision

Use PostgreSQL as the production database and host it through Supabase.

## Why

The application contains relational data such as:

- Users
- Expense reports
- Expense lines
- Approvers
- Status history
- Comments
- Alerts

PostgreSQL provides strong relational integrity through foreign keys,
constraints, transactions, and indexes.

Supabase provides managed PostgreSQL infrastructure suitable for a deployed
application.

## Alternatives Considered

- SQLite
- Other relational databases

## Trade-off

A managed PostgreSQL database requires more setup than a local SQLite
database, but it is more appropriate for a persistent deployed application.

---

# Decision 4 — Reversed Decision: SQLite → Supabase PostgreSQL

## Initial Decision

During the early planning stage, SQLite was considered because it is simple
for local development and does not require a separate database server.

## Problem Identified

The project needs a working deployed application.

A local SQLite database depends on the filesystem of the hosting environment.
For a deployed backend, this can create persistence and operational concerns.

## Revised Decision

The database approach was changed from SQLite to Supabase PostgreSQL.

## Why the Decision Was Reversed

Supabase provides a persistent managed PostgreSQL database that is more
appropriate for the application's deployment architecture.

The final architecture is:

```text
React + Vite
      ↓
Node.js + Express
      ↓
Supabase PostgreSQL