const pool = require("./db");

async function testDatabaseConnection() {
    try {
        const result = await pool.query(
            "SELECT NOW() AS current_time"
        );

        console.log("=================================");
        console.log("Database connected successfully!");
        console.log("Database time:", result.rows[0].current_time);
        console.log("=================================");
    } catch (error) {
        console.error("=================================");
        console.error("Database connection failed!");
        console.error(error.message);
        console.error("=================================");
    } finally {
        await pool.end();
    }
}

testDatabaseConnection();