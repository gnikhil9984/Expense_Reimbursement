const pool = require("../db");

async function healthCheck(req, res) {
    try {
        const result = await pool.query(
            "SELECT NOW() AS current_time"
        );

        res.status(200).json({
            success: true,
            message: "Expense Reimbursement API is running",
            database: "connected",
            serverTime: result.rows[0].current_time,
        });
    } catch (error) {
        console.error("Health check failed:", error.message);

        res.status(500).json({
            success: false,
            message: "API is running but database connection failed",
        });
    }
}

module.exports = {
    healthCheck,
};