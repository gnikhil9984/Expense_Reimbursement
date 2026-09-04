const express = require("express");

const {
    register,
    login,
    me,
} = require("../controllers/auth/authController");

const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", authMiddleware, me);
router.get(
    "/approver-test",
    authMiddleware,
    requireRole("approver"),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Approver access granted",
            user: req.user,
        });
    }
);

module.exports = router;