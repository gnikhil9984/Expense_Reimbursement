# Database Schema

## Overview

The Expense Reimbursement application uses PostgreSQL as its relational
database, hosted through Supabase.

The database supports:

- User authentication and roles
- Expense report management
- Expense line management
- Approver assignment
- Report approval and rejection
- Status history and audit tracking
- Report search and filtering
- Bulk report operations
- CSV export

The schema is organized into separate tables to maintain data consistency,
clear relationships, and separation of responsibilities.

---

# 1. Users

The `users` table stores application users and their roles.

| Column | Type | Nullable | Description |
|---|---|---|---|
| id | BIGSERIAL | No | Primary key |
| name | VARCHAR(100) | No | User's name |
| email | VARCHAR(255) | No | Unique login email |
| password_hash | TEXT | No | Hashed password |
| role | VARCHAR(20) | No | User role |
| created_at | TIMESTAMPTZ | No | Account creation timestamp |

### Roles

The application supports two roles:

- `employee`
- `approver`

### Constraints

- `id` is the primary key.
- `email` must be unique.
- `role` is restricted to valid application roles.
- Passwords are stored as hashes.
- Plaintext passwords are not stored in the database.

---

# 2. Expense Reports

The `expense_reports` table stores the main expense reimbursement reports.

| Column | Type | Nullable | Description |
|---|---|---|---|
| id | BIGSERIAL | No | Primary key |
| owner_id | BIGINT | No | Employee who owns the report |
| title | VARCHAR(200) | No | Report title |
| start_date | DATE | No | Expense period start date |
| end_date | DATE | No | Expense period end date |
| status | VARCHAR(20) | No | Current report status |
| submitted_at | TIMESTAMPTZ | Yes | Submission timestamp |
| approved_at | TIMESTAMPTZ | Yes | Approval timestamp |
| paid_at | TIMESTAMPTZ | Yes | Payment timestamp |
| is_archived | BOOLEAN | No | Whether the report is archived |
| created_at | TIMESTAMPTZ | No | Creation timestamp |
| updated_at | TIMESTAMPTZ | No | Last update timestamp |

### Report Statuses

The application supports the following report statuses:

- `Draft`
- `Submitted`
- `Approved`
- `Rejected`
- `Paid`

### Constraints

- `owner_id` references `users.id`.
- `end_date` must be greater than or equal to `start_date`.
- Report status is restricted to supported statuses.
- A report belongs to its employee owner.
- Report modification is validated according to its current status.

---

# 3. Expense Lines

The `expense_lines` table stores individual expenses belonging to an
expense report.

| Column | Type | Nullable | Description |
|---|---|---|---|
| id | BIGSERIAL | No | Primary key |
| report_id | BIGINT | No | Parent expense report |
| expense_date | DATE | No | Date of the expense |
| amount | NUMERIC(12,2) | No | Expense amount |
| category | VARCHAR(50) | No | Expense category |
| description | TEXT | No | Expense description |
| created_at | TIMESTAMPTZ | No | Creation timestamp |

### Expense Categories

The application supports expense categories such as:

- `Travel`
- `Meals`
- `Accommodation`
- `Supplies`
- `Other`

### Constraints

- `report_id` references `expense_reports.id`.
- Expense amount must be greater than zero.
- Expense lines belong to a parent expense report.
- Expense line operations are validated by the backend.
- Deleting a report also removes its related expense lines according to
  the database relationship.

---

# 4. Report Approvers

The `report_approvers` table stores the relationship between expense
reports and their assigned approvers.

A report can have an approver assignment, allowing the backend to verify
whether an approver is authorized to perform approval or rejection actions.

| Column | Type | Nullable | Description |
|---|---|---|---|
| report_id | BIGINT | No | Expense report ID |
| approver_id | BIGINT | No | Assigned approver user ID |
| assigned_at | TIMESTAMPTZ | No | Assignment timestamp |

### Constraints

- Composite primary key:

```text
(report_id, approver_id)