const pool = require("../../db");

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

        return res.status(200).json({
            success: true,
            message: "Report approved successfully",
            report: updatedReport.rows[0],
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
                 updated_at = NOW()
             WHERE id = $1
             RETURNING id, owner_id, title, status, updated_at`,
            [reportId]
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
    submitReport,
    approveReport, 
};