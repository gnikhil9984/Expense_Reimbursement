const express = require("express");

const {
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