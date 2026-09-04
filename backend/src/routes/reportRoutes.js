const express = require("express");

const {
    submitReport,
    approveReport,
} = require("../controllers/report/reportController");

const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();

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

module.exports = router;