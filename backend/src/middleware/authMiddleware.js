const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    try {
        // 1. Get Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization token is required",
            });
        }

        // 2. Check Bearer format
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format",
            });
        }

        // 3. Extract token
        const token = authHeader.split(" ")[1];

        // 4. Check JWT secret
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured");
        }

        // 5. Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // 6. Attach user information to request
        req.user = decoded;

        // 7. Continue to next middleware/controller
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
}

module.exports = authMiddleware;