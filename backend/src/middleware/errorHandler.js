function errorHandler(err, req, res, next) {
    console.error("Server Error:", err.message);

    res.status(500).json({
        success: false,
        message: "Internal server error",
    });
}

module.exports = errorHandler;