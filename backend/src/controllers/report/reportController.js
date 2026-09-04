const pool = require("../../db");

async function createReport(req, res, next) {
    try {
        const { title, start_date, end_date } = req.body;
        const ownerId = req.user.userId;

        // 1. Validate required fields
        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Report title is required",
            });
        }

        if (!start_date || !end_date) {
            return res.status(400).json({
                success: false,
                message: "start_date and end_date are required",
            });
        }

        // 2. Validate date range
        if (new Date(start_date) > new Date(end_date)) {
            return res.status(400).json({
                success: false,
                message: "start_date cannot be later than end_date",
            });
        }

        // 3. Create report
        const result = await pool.query(
            `INSERT INTO expense_reports
                (
                    owner_id,
                    title,
                    start_date,
                    end_date,
                    status,
                    is_archived,
                    created_at,
                    updated_at
                )
             VALUES
                ($1, $2, $3, $4, 'Draft', false, NOW(), NOW())
             RETURNING
                id,
                owner_id,
                title,
                start_date,
                end_date,
                status,
                is_archived,
                created_at,
                updated_at`,
            [
                ownerId,
                title.trim(),
                start_date,
                end_date,
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Expense report created successfully",
            report: result.rows[0],
        });
    } catch (error) {
        next(error);
    }
}

async function updateReport(req, res, next) {
    try {
        const reportId = req.params.id;
        const userId = req.user.userId;

        const { title, start_date, end_date } = req.body;

        // 1. Get report
        const result = await pool.query(
            `SELECT
                id,
                owner_id,
                title,
                start_date,
                end_date,
                status,
                is_archived
             FROM expense_reports
             WHERE id = $1`,
            [reportId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Report not found",
            });
        }

        const report = result.rows[0];

        // 2. Verify ownership
        if (report.owner_id !== userId) {
            return res.status(403).json({
                success: false,
                message: "You can only edit your own expense report",
            });
        }

        // 3. Only Draft reports can be edited
        if (report.status !== "Draft") {
            return res.status(400).json({
                success: false,
                message: "Only draft reports can be edited",
            });
        }

        // 4. Archived reports cannot be edited
        if (report.is_archived) {
            return res.status(400).json({
                success: false,
                message: "Archived reports cannot be edited",
            });
        }

        // 5. Validate that at least one field is provided
        if (
            title === undefined &&
            start_date === undefined &&
            end_date === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "At least one field is required to update",
            });
        }

        // 6. Validate title
        const updatedTitle =
            title !== undefined ? title.trim() : report.title;

        if (!updatedTitle) {
            return res.status(400).json({
                success: false,
                message: "Report title cannot be empty",
            });
        }

        // 7. Keep existing dates if not provided
        const updatedStartDate =
            start_date !== undefined ? start_date : report.start_date;

        const updatedEndDate =
            end_date !== undefined ? end_date : report.end_date;

        // 8. Validate date format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

        if (!dateRegex.test(updatedStartDate)) {
            return res.status(400).json({
                success: false,
                message: "start_date must be in YYYY-MM-DD format",
            });
        }

        if (!dateRegex.test(updatedEndDate)) {
            return res.status(400).json({
                success: false,
                message: "end_date must be in YYYY-MM-DD format",
            });
        }

        // 9. Validate date range
        if (updatedStartDate > updatedEndDate) {
            return res.status(400).json({
                success: false,
                message: "start_date cannot be after end_date",
            });
        }

        // 10. Update report
        const updatedReport = await pool.query(
            `UPDATE expense_reports
             SET
                title = $1,
                start_date = $2,
                end_date = $3,
                updated_at = NOW()
             WHERE id = $4
             RETURNING
                id,
                owner_id,
                title,
                start_date,
                end_date,
                status,
                is_archived,
                updated_at`,
            [
                updatedTitle,
                updatedStartDate,
                updatedEndDate,
                reportId,
            ]
        );

        return res.status(200).json({
            success: true,
            message: "Expense report updated successfully",
            report: updatedReport.rows[0],
        });
    } catch (error) {
        next(error);
    }
}

async function archiveReport(req, res, next) {
    try {
        const reportId = req.params.id;
        const userId = req.user.userId;

        // 1. Get report
        const result = await pool.query(
            `SELECT
                id,
                owner_id,
                title,
                status,
                is_archived
             FROM expense_reports
             WHERE id = $1`,
            [reportId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Report not found",
            });
        }

        const report = result.rows[0];

        // 2. Only owner can archive their report
        if (report.owner_id !== userId) {
            return res.status(403).json({
                success: false,
                message: "You can only archive your own expense report",
            });
        }

        // 3. Only Draft reports can be archived
        if (report.status !== "Draft") {
            return res.status(400).json({
                success: false,
                message: "Only draft reports can be archived",
            });
        }

        // 4. Prevent archiving an already archived report
        if (report.is_archived) {
            return res.status(400).json({
                success: false,
                message: "Report is already archived",
            });
        }

        // 5. Archive report
        const updatedReport = await pool.query(
            `UPDATE expense_reports
             SET
                is_archived = true,
                updated_at = NOW()
             WHERE id = $1
             RETURNING
                id,
                owner_id,
                title,
                status,
                is_archived,
                updated_at`,
            [reportId]
        );

        return res.status(200).json({
            success: true,
            message: "Expense report archived successfully",
            report: updatedReport.rows[0],
        });
    } catch (error) {
        next(error);
    }
}

async function approveReport(req, res, next) {
    try {
        const reportId = req.params.id;
        const approverId = req.user.userId;

        // 1. Get report and verify approver assignment
        const result = await pool.query(
            `SELECT
                er.id,
                er.owner_id,
                er.status,
                ra.approver_id
             FROM expense_reports er
             JOIN report_approvers ra
                ON er.id = ra.report_id
             WHERE er.id = $1
               AND ra.approver_id = $2`,
            [reportId, approverId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Report not found or you are not an assigned approver",
            });
        }

        const report = result.rows[0];

        // 2. Prevent self-approval
        if (report.owner_id === approverId) {
            return res.status(403).json({
                success: false,
                message: "You cannot approve your own expense report",
            });
        }

        // 3. Check report status
        if (report.status !== "Submitted") {
            return res.status(400).json({
                success: false,
                message: "Only submitted reports can be approved",
            });
        }

        // 4. Approve report
        const updatedReport = await pool.query(
            `UPDATE expense_reports
             SET status = 'Approved',
                 approved_at = NOW(),
                 updated_at = NOW()
             WHERE id = $1
             RETURNING id, owner_id, title, status, approved_at`,
            [reportId]
        );

        // 5. Record status change in history
        await pool.query(
            `INSERT INTO status_history
                (report_id, old_status, new_status, changed_by)
            VALUES ($1, $2, $3, $4)`,
            [
                reportId,
                report.status,
                "Approved",
                approverId,
            ]
        );

        return res.status(200).json({
            success: true,
            message: "Report approved successfully",
            report: updatedReport.rows[0],
        });
    } catch (error) {
        next(error);
    }
}

async function rejectReport(req, res, next) {
    try {
        const reportId = req.params.id;
        const approverId = req.user.userId;
        const { reason } = req.body;

        // 1. Validate rejection reason
        if (!reason || !reason.trim()) {
            return res.status(400).json({
                success: false,
                message: "Rejection reason is required",
            });
        }

        // 2. Get report and verify approver assignment
        const result = await pool.query(
            `SELECT
                er.id,
                er.owner_id,
                er.status,
                ra.approver_id
             FROM expense_reports er
             JOIN report_approvers ra
                ON er.id = ra.report_id
             WHERE er.id = $1
               AND ra.approver_id = $2`,
            [reportId, approverId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Report not found or you are not an assigned approver",
            });
        }

        const report = result.rows[0];

        // 3. Prevent self-rejection
        if (report.owner_id === approverId) {
            return res.status(403).json({
                success: false,
                message: "You cannot reject your own expense report",
            });
        }

        // 4. Only Submitted reports can be rejected
        if (report.status !== "Submitted") {
            return res.status(400).json({
                success: false,
                message: "Only submitted reports can be rejected",
            });
        }

        // 5. Reject report and return it to Draft
        const updatedReport = await pool.query(
            `UPDATE expense_reports
             SET status = 'Draft',
                 submitted_at = NULL,
                 updated_at = NOW()
             WHERE id = $1
             RETURNING
                id,
                owner_id,
                title,
                status,
                submitted_at,
                updated_at`,
            [reportId]
        );

        // 6. Record rejection in status history
        await pool.query(
            `INSERT INTO status_history
                (report_id, old_status, new_status, changed_by, reason)
             VALUES ($1, $2, $3, $4, $5)`,
            [
                reportId,
                report.status,
                "Rejected",
                approverId,
                reason.trim(),
            ]
        );

        return res.status(200).json({
            success: true,
            message: "Report rejected successfully",
            report: updatedReport.rows[0],
            rejection: {
                reason: reason.trim(),
            },
        });

    } catch (error) {
        next(error);
    }
}

async function restoreReport(req, res, next) {
    try {
        const reportId = req.params.id;
        const userId = req.user.userId;

        // 1. Find report and verify ownership
        const result = await pool.query(
            `SELECT id, owner_id, title, status, is_archived
             FROM expense_reports
             WHERE id = $1`,
            [reportId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Report not found",
            });
        }

        const report = result.rows[0];

        // 2. Only report owner can restore
        if (report.owner_id !== userId) {
            return res.status(403).json({
                success: false,
                message: "You can only restore your own expense report",
            });
        }

        // 3. Report must be archived
        if (!report.is_archived) {
            return res.status(400).json({
                success: false,
                message: "Report is not archived",
            });
        }

        // 4. Restore report
        const updatedReport = await pool.query(
            `UPDATE expense_reports
             SET is_archived = false,
                 updated_at = NOW()
             WHERE id = $1
             RETURNING id, owner_id, title, status, is_archived, updated_at`,
            [reportId]
        );

        return res.status(200).json({
            success: true,
            message: "Expense report restored successfully",
            report: updatedReport.rows[0],
        });
    } catch (error) {
        next(error);
    }
}

async function addExpenseLine(req, res, next) {
    try {
        const reportId = req.params.id;
        const userId = req.user.userId;

        const {
            expense_date,
            amount,
            category,
            description,
        } = req.body;

        // 1. Check report exists and belongs to user
        const reportResult = await pool.query(
            `SELECT id, owner_id, status, is_archived
             FROM expense_reports
             WHERE id = $1`,
            [reportId]
        );

        if (reportResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Expense report not found",
            });
        }

        const report = reportResult.rows[0];

        // 2. Only report owner can add expense lines
        if (report.owner_id !== userId) {
            return res.status(403).json({
                success: false,
                message: "You can only add expenses to your own report",
            });
        }

        // 3. Only Draft reports can be modified
        if (report.status !== "Draft") {
            return res.status(400).json({
                success: false,
                message: "Expense lines can only be added to draft reports",
            });
        }

        // 4. Archived reports cannot be modified
        if (report.is_archived) {
            return res.status(400).json({
                success: false,
                message: "Cannot add expense line to an archived report",
            });
        }

        // 5. Validate required fields
        if (!expense_date) {
            return res.status(400).json({
                success: false,
                message: "Expense date is required",
            });
        }

        if (amount === undefined || amount === null || amount === "") {
            return res.status(400).json({
                success: false,
                message: "Expense amount is required",
            });
        }

        if (typeof category !== "string" || !category.trim()) {
            return res.status(400).json({
                success: false,
                message: "Expense category is required and must be a valid text value",
            });
        }

        if (!description || !description.trim()) {
            return res.status(400).json({
                success: false,
                message: "Expense description is required",
            });
        }

        // 6. Validate amount
        const numericAmount = Number(amount);

        if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Expense amount must be greater than 0",
            });
        }

        // 7. Validate date format
        if (!/^\d{4}-\d{2}-\d{2}$/.test(expense_date)) {
            return res.status(400).json({
                success: false,
                message: "Expense date must be in YYYY-MM-DD format",
            });
        }

        // 8. Create expense line
        const result = await pool.query(
            `INSERT INTO expense_lines
                (report_id, expense_date, amount, category, description)
             VALUES
                ($1, $2, $3, $4, $5)
             RETURNING
                id,
                report_id,
                expense_date,
                amount,
                category,
                description,
                created_at`,
            [
                reportId,
                expense_date,
                numericAmount,
                category.trim(),
                description.trim(),
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Expense line added successfully",
            expense: result.rows[0],
        });
    } catch (error) {
        next(error);
    }
}

async function updateExpenseLine(req, res, next) {
    try {
        const reportId = req.params.id;
        const lineId = req.params.lineId;
        const userId = req.user.userId;

        const {
            expense_date,
            amount,
            category,
            description,
        } = req.body;

        // 1. Check report exists and verify ownership
        const reportResult = await pool.query(
            `SELECT id, owner_id, status, is_archived
             FROM expense_reports
             WHERE id = $1`,
            [reportId]
        );

        if (reportResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Expense report not found",
            });
        }

        const report = reportResult.rows[0];

        // 2. Only report owner can edit expense lines
        if (report.owner_id !== userId) {
            return res.status(403).json({
                success: false,
                message: "You can only edit expenses in your own report",
            });
        }

        // 3. Only Draft reports can be modified
        if (report.status !== "Draft") {
            return res.status(400).json({
                success: false,
                message: "Expense lines can only be edited in draft reports",
            });
        }

        // 4. Archived reports cannot be modified
        if (report.is_archived) {
            return res.status(400).json({
                success: false,
                message: "Cannot edit expense line in an archived report",
            });
        }

        // 5. Check expense line belongs to this report
        const expenseResult = await pool.query(
            `SELECT id
             FROM expense_lines
             WHERE id = $1
               AND report_id = $2`,
            [lineId, reportId]
        );

        if (expenseResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Expense line not found",
            });
        }

        // 6. Validate required fields
        if (!expense_date) {
            return res.status(400).json({
                success: false,
                message: "Expense date is required",
            });
        }

        if (amount === undefined || amount === null || amount === "") {
            return res.status(400).json({
                success: false,
                message: "Expense amount is required",
            });
        }

        if (typeof category !== "string" || !category.trim()) {
            return res.status(400).json({
                success: false,
                message: "Expense category is required and must be a valid text value",
            });
        }

        if (!description || !description.trim()) {
            return res.status(400).json({
                success: false,
                message: "Expense description is required",
            });
        }

        // 7. Validate amount
        const numericAmount = Number(amount);

        if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Expense amount must be greater than 0",
            });
        }

        // 8. Validate date format
        if (!/^\d{4}-\d{2}-\d{2}$/.test(expense_date)) {
            return res.status(400).json({
                success: false,
                message: "Expense date must be in YYYY-MM-DD format",
            });
        }

        // 9. Update expense line
        const result = await pool.query(
            `UPDATE expense_lines
             SET expense_date = $1,
                 amount = $2,
                 category = $3,
                 description = $4
             WHERE id = $5
               AND report_id = $6
             RETURNING
                id,
                report_id,
                expense_date,
                amount,
                category,
                description,
                created_at`,
            [
                expense_date,
                numericAmount,
                category.trim(),
                description.trim(),
                lineId,
                reportId,
            ]
        );

        return res.status(200).json({
            success: true,
            message: "Expense line updated successfully",
            expense: result.rows[0],
        });

    } catch (error) {
        next(error);
    }
}

async function deleteExpenseLine(req, res, next) {
    try {
        const reportId = req.params.id;
        const expenseLineId = req.params.lineId;
        const userId = req.user.userId;

        // 1. Check expense line exists and belongs to this report
        const result = await pool.query(
            `SELECT
                el.id,
                el.report_id,
                er.owner_id,
                er.status,
                er.is_archived
             FROM expense_lines el
             JOIN expense_reports er
                ON el.report_id = er.id
             WHERE el.id = $1
               AND el.report_id = $2`,
            [expenseLineId, reportId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Expense line not found",
            });
        }

        const expenseLine = result.rows[0];

        // 2. Only report owner can delete expense line
        if (expenseLine.owner_id !== userId) {
            return res.status(403).json({
                success: false,
                message: "You can only delete expenses from your own report",
            });
        }

        // 3. Only Draft reports can be modified
        if (expenseLine.status !== "Draft") {
            return res.status(400).json({
                success: false,
                message: "Expense lines can only be deleted from draft reports",
            });
        }

        // 4. Archived reports cannot be modified
        if (expenseLine.is_archived) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete expense line from an archived report",
            });
        }

        // 5. Delete expense line
        const deletedLine = await pool.query(
            `DELETE FROM expense_lines
             WHERE id = $1
               AND report_id = $2
             RETURNING
                id,
                report_id,
                expense_date,
                amount,
                category,
                description,
                created_at`,
            [expenseLineId, reportId]
        );

        return res.status(200).json({
            success: true,
            message: "Expense line deleted successfully",
            expense: deletedLine.rows[0],
        });
    } catch (error) {
        next(error);
    }
}

async function getReportDetails(req, res, next) {
    try {
        const reportId = req.params.id;
        const userId = req.user.userId;

        // 1. Get report and verify ownership
        const reportResult = await pool.query(
            `SELECT
                id,
                owner_id,
                title,
                start_date,
                end_date,
                status,
                submitted_at,
                approved_at,
                paid_at,
                is_archived,
                created_at,
                updated_at
             FROM expense_reports
             WHERE id = $1`,
            [reportId]
        );

        if (reportResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Report not found",
            });
        }

        const report = reportResult.rows[0];

        // 2. Only owner can view report details
        if (report.owner_id !== userId) {
            return res.status(403).json({
                success: false,
                message: "You can only view your own expense report",
            });
        }

        // 3. Get expense lines + calculate total on server
        const expenseResult = await pool.query(
            `SELECT
                id,
                report_id,
                expense_date,
                amount,
                category,
                description,
                created_at
             FROM expense_lines
             WHERE report_id = $1
             ORDER BY expense_date ASC, id ASC`,
            [reportId]
        );

        // 4. Server-side total calculation
        const totalResult = await pool.query(
            `SELECT COALESCE(SUM(amount), 0) AS total_amount
             FROM expense_lines
             WHERE report_id = $1`,
            [reportId]
        );

        const totalAmount = totalResult.rows[0].total_amount;

        // 5. Return report + expenses + calculated total
        return res.status(200).json({
            success: true,
            report: {
                ...report,
                total_amount: totalAmount,
                expenses: expenseResult.rows,
            },
        });

    } catch (error) {
        next(error);
    }
}


async function submitReport(req, res, next) {
    try {
        const reportId = req.params.id;
        const userId = req.user.userId;

        // 1. Get report and verify ownership
        const result = await pool.query(
            `SELECT id, owner_id, title, status
             FROM expense_reports
             WHERE id = $1`,
            [reportId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Report not found",
            });
        }

        const report = result.rows[0];

        // 2. Only report owner can submit
        if (report.owner_id !== userId) {
            return res.status(403).json({
                success: false,
                message: "You can only submit your own expense report",
            });
        }

        // 3. Only Draft reports can be submitted
        if (report.status !== "Draft") {
            return res.status(400).json({
                success: false,
                message: "Only draft reports can be submitted",
            });
        }

        // 4. Submit report
        const updatedReport = await pool.query(
            `UPDATE expense_reports
            SET status = 'Submitted',
                submitted_at = NOW(),
                updated_at = NOW()
            WHERE id = $1
            RETURNING id, owner_id, title, status, submitted_at, updated_at`,
            [reportId]
        );

        // 5. Record status change in history
        await pool.query(
            `INSERT INTO status_history
                (report_id, old_status, new_status, changed_by)
            VALUES ($1, $2, $3, $4)`,
            [
                reportId,
                report.status,
                "Submitted",
                userId,
            ]
        );

        return res.status(200).json({
            success: true,
            message: "Report submitted successfully",
            report: updatedReport.rows[0],
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createReport,
    updateReport,
    archiveReport,
    submitReport,
    approveReport,
    rejectReport,
    restoreReport, 
    addExpenseLine,
    updateExpenseLine,
    deleteExpenseLine,
    getReportDetails,
};