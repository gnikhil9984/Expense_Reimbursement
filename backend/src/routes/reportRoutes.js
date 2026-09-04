const express = require("express");

const {
    createReport,
    updateReport,
    archiveReport,
    submitReport,
    approveReport,
    bulkApproveReports,
    bulkRejectReports,
    rejectReport,
    restoreReport,
    addExpenseLine,
    updateExpenseLine,
    deleteExpenseLine,
    getReportDetails,
    getMyReports,
    exportReports,
} = require("../controllers/report/reportController");

const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();

// Employee creates expense report
router.post(
    "/",
    authMiddleware,
    createReport
);

// Employee gets own reports with search, filters and pagination
router.get(
    "/",
    authMiddleware,
    getMyReports
);

// Employee exports approved and unpaid reports as CSV
router.get(
    "/export",
    authMiddleware,
    exportReports
);

// Approver bulk approves assigned submitted reports
router.patch(
    "/bulk-approve",
    authMiddleware,
    requireRole("approver"),
    bulkApproveReports
);

// Approver bulk rejects assigned submitted reports
router.patch(
    "/bulk-reject",
    authMiddleware,
    requireRole("approver"),
    bulkRejectReports
);

// Employee updates own draft report
router.patch(
    "/:id",
    authMiddleware,
    updateReport
);

// Employee archives own draft report
router.patch(
    "/:id/archive",
    authMiddleware,
    archiveReport
);


// Employee submits own report
router.post(
    "/:id/submit",
    authMiddleware,
    submitReport
);

// Approver-only report approval
router.patch(
    "/:id/approve",
    authMiddleware,
    requireRole("approver"),
    approveReport
);

// Approver rejects an assigned submitted report
router.patch(
    "/:id/reject",
    authMiddleware,
    requireRole("approver"),
    rejectReport
);

// Employee restores own archived report
router.patch(
    "/:id/restore",
    authMiddleware,
    restoreReport
);

// Employee adds expense line to own draft report
router.post(
    "/:id/lines",
    authMiddleware,
    addExpenseLine
);

// Employee edits expense line in own draft report
router.patch(
    "/:id/lines/:lineId",
    authMiddleware,
    updateExpenseLine
);

// Employee deletes expense line from own draft report
router.delete(
    "/:id/lines/:lineId",
    authMiddleware,
    deleteExpenseLine
);

// Employee gets report details with expense lines and server-calculated total
router.get(
    "/:id",
    authMiddleware,
    getReportDetails
);

module.exports = router;