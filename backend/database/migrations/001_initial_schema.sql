-- ============================================================
-- Expense Reimbursement System
-- Initial Database Schema
-- Migration: 001_initial_schema.sql
-- ============================================================


-- ============================================================
-- 1. USERS
-- ============================================================

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    password_hash TEXT NOT NULL,

    role VARCHAR(20) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT users_role_check
        CHECK (role IN ('employee', 'approver'))
);


-- ============================================================
-- 2. EXPENSE REPORTS
-- ============================================================

CREATE TABLE expense_reports (
    id BIGSERIAL PRIMARY KEY,

    owner_id BIGINT NOT NULL,

    title VARCHAR(200) NOT NULL,

    start_date DATE NOT NULL,

    end_date DATE NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'Draft',

    submitted_at TIMESTAMPTZ,

    approved_at TIMESTAMPTZ,

    paid_at TIMESTAMPTZ,

    is_archived BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT expense_reports_owner_fk
        FOREIGN KEY (owner_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT expense_reports_status_check
        CHECK (
            status IN (
                'Draft',
                'Submitted',
                'Approved',
                'Rejected',
                'Paid'
            )
        ),

    CONSTRAINT expense_reports_date_check
        CHECK (end_date >= start_date)
);


-- ============================================================
-- 3. EXPENSE LINES
-- ============================================================

CREATE TABLE expense_lines (
    id BIGSERIAL PRIMARY KEY,

    report_id BIGINT NOT NULL,

    expense_date DATE NOT NULL,

    amount NUMERIC(12, 2) NOT NULL,

    category VARCHAR(50) NOT NULL,

    description TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT expense_lines_report_fk
        FOREIGN KEY (report_id)
        REFERENCES expense_reports(id)
        ON DELETE CASCADE,

    CONSTRAINT expense_lines_amount_check
        CHECK (amount > 0),

    CONSTRAINT expense_lines_category_check
        CHECK (
            category IN (
                'Travel',
                'Meals',
                'Accommodation',
                'Supplies',
                'Other'
            )
        )
);


-- ============================================================
-- 4. REPORT APPROVERS
-- Many-to-many relationship between reports and approvers
-- ============================================================

CREATE TABLE report_approvers (
    report_id BIGINT NOT NULL,

    approver_id BIGINT NOT NULL,

    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (report_id, approver_id),

    CONSTRAINT report_approvers_report_fk
        FOREIGN KEY (report_id)
        REFERENCES expense_reports(id)
        ON DELETE CASCADE,

    CONSTRAINT report_approvers_approver_fk
        FOREIGN KEY (approver_id)
        REFERENCES users(id)
        ON DELETE RESTRICT
);


-- ============================================================
-- 5. STATUS HISTORY
-- Immutable report lifecycle history
-- ============================================================

CREATE TABLE status_history (
    id BIGSERIAL PRIMARY KEY,

    report_id BIGINT NOT NULL,

    old_status VARCHAR(20),

    new_status VARCHAR(20) NOT NULL,

    changed_by BIGINT NOT NULL,

    reason TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT status_history_report_fk
        FOREIGN KEY (report_id)
        REFERENCES expense_reports(id)
        ON DELETE RESTRICT,

    CONSTRAINT status_history_changed_by_fk
        FOREIGN KEY (changed_by)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT status_history_old_status_check
        CHECK (
            old_status IS NULL
            OR old_status IN (
                'Draft',
                'Submitted',
                'Approved',
                'Rejected',
                'Paid'
            )
        ),

    CONSTRAINT status_history_new_status_check
        CHECK (
            new_status IN (
                'Draft',
                'Submitted',
                'Approved',
                'Rejected',
                'Paid'
            )
        )
);


-- ============================================================
-- 6. COMMENTS
-- ============================================================

CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,

    report_id BIGINT NOT NULL,

    user_id BIGINT NOT NULL,

    comment TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT comments_report_fk
        FOREIGN KEY (report_id)
        REFERENCES expense_reports(id)
        ON DELETE RESTRICT,

    CONSTRAINT comments_user_fk
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT comments_text_check
        CHECK (LENGTH(TRIM(comment)) > 0)
);


-- ============================================================
-- 7. ALERTS
-- ============================================================

CREATE TABLE alerts (
    id BIGSERIAL PRIMARY KEY,

    report_id BIGINT NOT NULL,

    approver_id BIGINT NOT NULL,

    dismissed_at TIMESTAMPTZ,

    next_alert_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT alerts_report_fk
        FOREIGN KEY (report_id)
        REFERENCES expense_reports(id)
        ON DELETE CASCADE,

    CONSTRAINT alerts_approver_fk
        FOREIGN KEY (approver_id)
        REFERENCES users(id)
        ON DELETE RESTRICT
);


-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_expense_reports_owner
    ON expense_reports(owner_id);

CREATE INDEX idx_expense_reports_status
    ON expense_reports(status);

CREATE INDEX idx_expense_reports_submitted_at
    ON expense_reports(submitted_at);

CREATE INDEX idx_expense_reports_archived
    ON expense_reports(is_archived);

CREATE INDEX idx_expense_lines_report
    ON expense_lines(report_id);

CREATE INDEX idx_expense_lines_category
    ON expense_lines(category);

CREATE INDEX idx_report_approvers_approver
    ON report_approvers(approver_id);

CREATE INDEX idx_status_history_report
    ON status_history(report_id);

CREATE INDEX idx_status_history_created_at
    ON status_history(created_at);

CREATE INDEX idx_comments_report
    ON comments(report_id);

CREATE INDEX idx_alerts_approver
    ON alerts(approver_id);

CREATE INDEX idx_alerts_next_alert
    ON alerts(next_alert_at);


-- ============================================================
-- IMMUTABLE STATUS HISTORY
-- Prevent UPDATE and DELETE operations
-- ============================================================

CREATE OR REPLACE FUNCTION prevent_status_history_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    RAISE EXCEPTION
        'Status history records cannot be modified or deleted';
END;
$$;


CREATE TRIGGER status_history_immutable_trigger
BEFORE UPDATE OR DELETE
ON status_history
FOR EACH ROW
EXECUTE FUNCTION prevent_status_history_changes();


-- ============================================================
-- END OF MIGRATION
-- ============================================================