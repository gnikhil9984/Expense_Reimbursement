const API_BASE_URL = "https://expense-reimbursement-backend-8pgv.onrender.com/api";

/* =====================================================
   COMMON API REQUEST HELPER
===================================================== */

async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    // Add JWT token if available
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    let response;

    try {
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });
    } catch (error) {
        throw new Error(
            "Unable to connect to the server. Please make sure the backend is running."
        );
    }

    const contentType =
        response.headers.get("content-type") || "";

    let data;

    if (contentType.includes("application/json")) {
        data = await response.json();
    } else {
        data = await response.text();
    }

    /* ================================================
       HANDLE UNAUTHORIZED REQUEST
    ================================================ */

    if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        throw new Error(
            typeof data === "object" && data?.message
                ? data.message
                : "Session expired. Please login again."
        );
    }

    /* ================================================
       HANDLE OTHER ERRORS
    ================================================ */

    if (!response.ok) {
        const message =
            typeof data === "object" && data?.message
                ? data.message
                : "Something went wrong.";

        throw new Error(message);
    }

    return data;
}


/* =====================================================
   AUTH APIs
===================================================== */

/**
 * Login user
 *
 * POST /api/auth/login
 */
export async function loginUser(email, password) {
    return apiRequest("/auth/login", {
        method: "POST",

        body: JSON.stringify({
            email,
            password,
        }),
    });
}


/**
 * Register employee
 *
 * POST /api/auth/register
 */
export async function registerUser(
    name,
    email,
    password
) {
    return apiRequest("/auth/register", {
        method: "POST",

        body: JSON.stringify({
            name,
            email,
            password,
        }),
    });
}


/**
 * Get currently logged-in user
 *
 * GET /api/auth/me
 */
export async function getCurrentUser() {
    return apiRequest("/auth/me");
}


/**
 * Logout
 */
export function logoutUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}


/* =====================================================
   REPORT APIs
===================================================== */

/**
 * Get employee reports
 *
 * Examples:
 *
 * getReports()
 *
 * getReports("?status=Draft")
 *
 * getReports("?search=travel")
 *
 * getReports("?status=Submitted&page=1&limit=10")
 */
export async function getReports(query = "") {
    return apiRequest(`/reports${query}`);
}


/**
 * Get single report details
 *
 * GET /api/reports/:id
 */
export async function getReportDetails(reportId) {
    return apiRequest(`/reports/${reportId}`);
}


/**
 * Create new expense report
 *
 * POST /api/reports
 */
export async function createReport(
    title,
    start_date,
    end_date
) {
    return apiRequest("/reports", {
        method: "POST",

        body: JSON.stringify({
            title,
            start_date,
            end_date,
        }),
    });
}


/**
 * Update expense report
 *
 * PATCH /api/reports/:id
 */
export async function updateReport(
    reportId,
    title,
    start_date,
    end_date
) {
    return apiRequest(`/reports/${reportId}`, {
        method: "PATCH",

        body: JSON.stringify({
            title,
            start_date,
            end_date,
        }),
    });
}


/**
 * Archive expense report
 *
 * PATCH /api/reports/:id/archive
 */
export async function archiveReport(reportId) {
    return apiRequest(
        `/reports/${reportId}/archive`,
        {
            method: "PATCH",
        }
    );
}


/**
 * Restore archived report
 *
 * PATCH /api/reports/:id/restore
 */
export async function restoreReport(reportId) {
    return apiRequest(
        `/reports/${reportId}/restore`,
        {
            method: "PATCH",
        }
    );
}


/**
 * Submit report for approval
 *
 * POST /api/reports/:id/submit
 */
export async function submitReport(reportId) {
    return apiRequest(
        `/reports/${reportId}/submit`,
        {
            method: "POST",
        }
    );
}


/* =====================================================
   APPROVER APIs
===================================================== */

/**
 * Approve single report
 *
 * PATCH /api/reports/:id/approve
 */
export async function approveReport(reportId) {
    return apiRequest(
        `/reports/${reportId}/approve`,
        {
            method: "PATCH",
        }
    );
}


/**
 * Reject single report
 *
 * PATCH /api/reports/:id/reject
 */
export async function rejectReport(
    reportId,
    reason
) {
    return apiRequest(
        `/reports/${reportId}/reject`,
        {
            method: "PATCH",

            body: JSON.stringify({
                reason,
            }),
        }
    );
}


/**
 * Bulk approve reports
 *
 * PATCH /api/reports/bulk-approve
 *
 * Example:
 *
 * bulkApproveReports([2, 4, 5])
 */
export async function bulkApproveReports(
    reportIds
) {
    return apiRequest(
        "/reports/bulk-approve",
        {
            method: "PATCH",

            body: JSON.stringify({
                reportIds,
            }),
        }
    );
}


/**
 * Bulk reject reports
 *
 * PATCH /api/reports/bulk-reject
 *
 * Example:
 *
 * bulkRejectReports(
 *     [2, 4],
 *     {
 *         "2": "Missing receipt",
 *         "4": "Invalid expense"
 *     }
 * )
 */
export async function bulkRejectReports(
    reportIds,
    reasons
) {
    return apiRequest(
        "/reports/bulk-reject",
        {
            method: "PATCH",

            body: JSON.stringify({
                reportIds,
                reasons,
            }),
        }
    );
}


/* =====================================================
   EXPENSE LINE APIs
===================================================== */

/**
 * Add expense line
 *
 * POST /api/reports/:id/lines
 */
export async function addExpenseLine(
    reportId,
    expenseData
) {
    return apiRequest(
        `/reports/${reportId}/lines`,
        {
            method: "POST",

            body: JSON.stringify(
                expenseData
            ),
        }
    );
}


/**
 * Update expense line
 *
 * PATCH /api/reports/:id/lines/:lineId
 */
export async function updateExpenseLine(
    reportId,
    lineId,
    expenseData
) {
    return apiRequest(
        `/reports/${reportId}/lines/${lineId}`,
        {
            method: "PATCH",

            body: JSON.stringify(
                expenseData
            ),
        }
    );
}


/**
 * Delete expense line
 *
 * DELETE /api/reports/:id/lines/:lineId
 */
export async function deleteExpenseLine(
    reportId,
    lineId
) {
    return apiRequest(
        `/reports/${reportId}/lines/${lineId}`,
        {
            method: "DELETE",
        }
    );
}


/* =====================================================
   CSV EXPORT
===================================================== */

/**
 * Export approved + unpaid reports
 *
 * GET /api/reports/export
 */
export async function exportReports() {
    const token = localStorage.getItem("token");

    const headers = {};

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    let response;

    try {
        response = await fetch(
            `${API_BASE_URL}/reports/export`,
            {
                method: "GET",
                headers,
            }
        );
    } catch (error) {
        throw new Error(
            "Unable to connect to the server. Please make sure the backend is running."
        );
    }

    /* ================================================
       HANDLE UNAUTHORIZED
    ================================================ */

    if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        throw new Error(
            "Session expired. Please login again."
        );
    }

    /* ================================================
       HANDLE EXPORT ERROR
    ================================================ */

    if (!response.ok) {
        const contentType =
            response.headers.get("content-type") || "";

        if (
            contentType.includes(
                "application/json"
            )
        ) {
            const data = await response.json();

            throw new Error(
                data?.message ||
                "CSV export failed."
            );
        }

        throw new Error(
            "CSV export failed."
        );
    }

    /* ================================================
       DOWNLOAD CSV
    ================================================ */

    const blob = await response.blob();

    const url =
        window.URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "expense-reports.csv";

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
}
