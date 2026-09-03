# AI Prompts & Development Notes

This document records important AI-assisted development prompts and the
corrections/decisions made during the development of the project.

AI assistance was used as a development aid. The generated suggestions were
reviewed, tested, and adjusted before being included in the project.

---

# 1. Project Requirement Analysis

## Prompt

> Analyze the Expense Reimbursement assignment requirements and break them
> into implementation phases suitable for a beginner developer. Identify
> the required backend, database, frontend, workflow, security, testing,
> documentation, and deployment tasks.

## Outcome

The project was divided into incremental phases:

1. Project setup
2. Backend foundation
3. Database
4. Authentication
5. Expense reports
6. Approval workflow
7. Search/filter/pagination
8. Bulk actions and CSV export
9. Dashboard
10. Comments and audit history
11. Alerts
12. Frontend
13. Testing
14. Deployment
15. Final documentation

---

# 2. Database Design

## Prompt

> Design a relational PostgreSQL schema for an Expense Reimbursement
> application supporting users, employee/approver roles, expense reports,
> expense lines, many-to-many approver assignments, immutable status history,
> comments, and stale approval alerts.

## Outcome

The schema was designed using seven main tables:

- users
- expense_reports
- expense_lines
- report_approvers
- status_history
- comments
- alerts

Foreign keys, check constraints, unique constraints, indexes, and an
immutable status-history trigger were added.

---

# 3. Database Connection

## Prompt

> Show how to connect a Node.js Express backend to PostgreSQL using the pg
> package and environment variables. Do not expose database credentials in
> source code.

## Outcome

A PostgreSQL connection pool was created in:

```text
backend/src/db.js