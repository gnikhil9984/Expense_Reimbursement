# Database Schema

## Overview

The Expense Reimbursement application uses PostgreSQL through Supabase.

The database is designed around users, expense reports, expense lines,
approval assignments, status history, comments, and stale approval alerts.

The schema is normalized to keep each type of information in its own table
and maintain clear relationships between entities.

---

# 1. Users

The `users` table stores application users and their roles.

| Column | Type | Nullable | Description |
|---|---|---|---|
| id | BIGSERIAL | No | Primary key |
| name | VARCHAR(100) | No | User's name |
| email | VARCHAR(255) | No | Unique login email |
| password_hash | TEXT | No | Hashed password |
| role | VARCHAR(20) | No | User role: employee or approver |
| created_at | TIMESTAMPTZ | No | Account creation timestamp |

### Constraints

- `id` is the primary key.
- `email` must be unique.
- `role` is restricted to `employee` or `approver`.
- Passwords are stored as hashes and never as plaintext.

---

# 2. Expense Reports

The `expense_reports` table stores the main reimbursement reports.

| Column | Type | Nullable | Description |
|---|---|---|---|
| id | BIGSERIAL | No | Primary key |
| owner_id | BIGINT | No | User who owns the report |
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

### Constraints

- `owner_id` references `users.id`.
- `end_date` must be greater than or equal to `start_date`.
- Status is restricted to:
  - `Draft`
  - `Submitted`
  - `Approved`
  - `Rejected`
  - `Paid`

---

# 3. Expense Lines

The `expense_lines` table stores individual expenses belonging to a report.

| Column | Type | Nullable | Description |
|---|---|---|---|
| id | BIGSERIAL | No | Primary key |
| report_id | BIGINT | No | Parent expense report |
| expense_date | DATE | No | Date of the expense |
| amount | NUMERIC(12,2) | No | Expense amount |
| category | VARCHAR(50) | No | Expense category |
| description | TEXT | No | Expense description |
| created_at | TIMESTAMPTZ | No | Creation timestamp |

### Constraints

- `report_id` references `expense_reports.id`.
- `amount` must be greater than zero.
- Category is restricted to:
  - `Travel`
  - `Meals`
  - `Accommodation`
  - `Supplies`
  - `Other`
- Deleting an expense report cascades to its expense lines.

---

# 4. Report Approvers

The `report_approvers` table represents the many-to-many relationship
between expense reports and approvers.

| Column | Type | Nullable | Description |
|---|---|---|---|
| report_id | BIGINT | No | Expense report ID |
| approver_id | BIGINT | No | Approver user ID |
| assigned_at | TIMESTAMPTZ | No | Assignment timestamp |

### Constraints

- Composite primary key:
  `report_id, approver_id`
- `report_id` references `expense_reports.id`.
- `approver_id` references `users.id`.
- The backend verifies that the assigned user has the `approver` role.

---

# 5. Status History

The `status_history` table stores an audit trail of report status changes.

| Column | Type | Nullable | Description |
|---|---|---|---|
| id | BIGSERIAL | No | Primary key |
| report_id | BIGINT | No | Related expense report |
| old_status | VARCHAR(20) | Yes | Previous status |
| new_status | VARCHAR(20) | No | New status |
| changed_by | BIGINT | No | User who changed the status |
| reason | TEXT | Yes | Reason for the change |
| created_at | TIMESTAMPTZ | No | Change timestamp |

### Immutability

Status history records are immutable.

A PostgreSQL trigger prevents both:

- `UPDATE`
- `DELETE`

operations on `status_history`.

This protects the audit trail from being modified after it has been created.

---

# 6. Comments

The `comments` table stores comments made by users on expense reports.

| Column | Type | Nullable | Description |
|---|---|---|---|
| id | BIGSERIAL | No | Primary key |
| report_id | BIGINT | No | Related expense report |
| user_id | BIGINT | No | Comment author |
| comment | TEXT | No | Comment content |
| created_at | TIMESTAMPTZ | No | Comment creation timestamp |

### Constraints

- `report_id` references `expense_reports.id`.
- `user_id` references `users.id`.
- Empty or whitespace-only comments are rejected.

---

# 7. Alerts

The `alerts` table stores stale approval alerts.

| Column | Type | Nullable | Description |
|---|---|---|---|
| id | BIGSERIAL | No | Primary key |
| report_id | BIGINT | No | Related expense report |
| approver_id | BIGINT | No | Approver receiving the alert |
| dismissed_at | TIMESTAMPTZ | Yes | Alert dismissal timestamp |
| next_alert_at | TIMESTAMPTZ | Yes | Next alert timestamp |
| created_at | TIMESTAMPTZ | No | Alert creation timestamp |

---

# Relationships

The main database relationships are:

```text
                         ┌──────────────┐
                         │    users     │
                         └──────┬───────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
                    ▼                       ▼
            expense_reports         report_approvers
                    │                       │
          ┌─────────┼─────────┐             │
          │         │         │             │
          ▼         ▼         ▼             │
   expense_lines  comments  status_history  │
          │         │         │             │
          └─────────┴─────────┴─────────────┘
                             
                    expense_reports
                          │
                          ▼
                       alerts