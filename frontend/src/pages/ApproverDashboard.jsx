import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getReports,
    approveReport,
    rejectReport,
    bulkApproveReports,
    bulkRejectReports,
    exportReports,
    logoutUser,
} from "../api/api";

import "../App.css";


function ApproverDashboard() {

    const navigate = useNavigate();

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("Submitted");

    const [selectedReports, setSelectedReports] = useState([]);


    /* =====================================================
       LOAD REPORTS
    ===================================================== */

    async function loadReports() {

        try {

            setLoading(true);
            setError("");

            const response = await getReports();

            console.log("Approver reports:", response);

            /*
             * Backend response may be:
             * { reports: [...] }
             * OR
             * { data: [...] }
             * OR
             * [...]
             */

            let reportList = [];

            if (Array.isArray(response)) {
                reportList = response;
            } else if (Array.isArray(response?.reports)) {
                reportList = response.reports;
            } else if (Array.isArray(response?.data)) {
                reportList = response.data;
            }

            setReports(reportList);

        } catch (err) {

            console.error("Load reports error:", err);

            setError(
                err.message ||
                "Unable to load expense reports."
            );

        } finally {

            setLoading(false);

        }
    }


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {

        loadReports();

    }, []);


    /* =====================================================
       LOGOUT
    ===================================================== */

    function handleLogout() {

        logoutUser();

        navigate("/login");

    }


    /* =====================================================
       APPROVE SINGLE REPORT
    ===================================================== */

    async function handleApprove(reportId) {

        const confirmed = window.confirm(
            "Are you sure you want to approve this report?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setActionLoading(true);
            setError("");
            setSuccess("");

            await approveReport(reportId);

            setSuccess(
                "Expense report approved successfully."
            );

            setSelectedReports((prev) =>
                prev.filter((id) => id !== reportId)
            );

            await loadReports();

        } catch (err) {

            console.error("Approve error:", err);

            setError(
                err.message ||
                "Unable to approve report."
            );

        } finally {

            setActionLoading(false);

        }
    }


    /* =====================================================
       REJECT SINGLE REPORT
    ===================================================== */

    async function handleReject(reportId) {

        const reason = window.prompt(
            "Enter rejection reason:"
        );

        if (!reason || !reason.trim()) {
            return;
        }

        try {

            setActionLoading(true);
            setError("");
            setSuccess("");

            await rejectReport(
                reportId,
                reason.trim()
            );

            setSuccess(
                "Expense report rejected successfully."
            );

            setSelectedReports((prev) =>
                prev.filter((id) => id !== reportId)
            );

            await loadReports();

        } catch (err) {

            console.error("Reject error:", err);

            setError(
                err.message ||
                "Unable to reject report."
            );

        } finally {

            setActionLoading(false);

        }
    }


    /* =====================================================
       SELECT / UNSELECT REPORT
    ===================================================== */

    function handleSelectReport(reportId) {

        setSelectedReports((previous) => {

            if (previous.includes(reportId)) {

                return previous.filter(
                    (id) => id !== reportId
                );

            }

            return [...previous, reportId];

        });
    }


    /* =====================================================
       SELECT ALL
    ===================================================== */

    function handleSelectAll() {

        if (selectedReports.length === filteredReports.length) {

            setSelectedReports([]);

        } else {

            setSelectedReports(
                filteredReports.map(
                    (report) => report.id
                )
            );

        }
    }


    /* =====================================================
       BULK APPROVE
    ===================================================== */

    async function handleBulkApprove() {

        if (selectedReports.length === 0) {

            setError(
                "Please select at least one report."
            );

            return;
        }

        const confirmed = window.confirm(
            `Approve ${selectedReports.length} selected report(s)?`
        );

        if (!confirmed) {
            return;
        }

        try {

            setActionLoading(true);
            setError("");
            setSuccess("");

            await bulkApproveReports(
                selectedReports
            );

            setSuccess(
                `${selectedReports.length} report(s) approved successfully.`
            );

            setSelectedReports([]);

            await loadReports();

        } catch (err) {

            console.error(
                "Bulk approve error:",
                err
            );

            setError(
                err.message ||
                "Unable to approve selected reports."
            );

        } finally {

            setActionLoading(false);

        }
    }


    /* =====================================================
       BULK REJECT
    ===================================================== */

    async function handleBulkReject() {

        if (selectedReports.length === 0) {

            setError(
                "Please select at least one report."
            );

            return;
        }

        const reason = window.prompt(
            "Enter rejection reason for selected reports:"
        );

        if (!reason || !reason.trim()) {
            return;
        }

        const reasons = {};

        selectedReports.forEach((id) => {

            reasons[id] = reason.trim();

        });


        try {

            setActionLoading(true);
            setError("");
            setSuccess("");

            await bulkRejectReports(
                selectedReports,
                reasons
            );

            setSuccess(
                `${selectedReports.length} report(s) rejected successfully.`
            );

            setSelectedReports([]);

            await loadReports();

        } catch (err) {

            console.error(
                "Bulk reject error:",
                err
            );

            setError(
                err.message ||
                "Unable to reject selected reports."
            );

        } finally {

            setActionLoading(false);

        }
    }


    /* =====================================================
       FILTER REPORTS
    ===================================================== */

    const filteredReports = reports.filter(
        (report) => {

            const title =
                String(report.title || "").toLowerCase();

            const employeeName =
                String(
                    report.employee_name ||
                    report.owner_name ||
                    report.name ||
                    ""
                ).toLowerCase();

            const email =
                String(
                    report.employee_email ||
                    report.owner_email ||
                    report.email ||
                    ""
                ).toLowerCase();

            const searchText =
                search.toLowerCase().trim();

            const matchesSearch =
                !searchText ||
                title.includes(searchText) ||
                employeeName.includes(searchText) ||
                email.includes(searchText);

            const matchesStatus =
                statusFilter === "All" ||
                report.status === statusFilter;

            return (
                matchesSearch &&
                matchesStatus
            );

        }
    );


    /* =====================================================
       COUNTS
    ===================================================== */

    const totalReports = reports.length;

    const submittedReports =
        reports.filter(
            (report) =>
                report.status === "Submitted"
        ).length;

    const approvedReports =
        reports.filter(
            (report) =>
                report.status === "Approved"
        ).length;

    const rejectedReports =
        reports.filter(
            (report) =>
                report.status === "Rejected"
        ).length;


    /* =====================================================
       FORMAT AMOUNT
    ===================================================== */

    function formatAmount(amount) {

        const value = Number(amount || 0);

        return value.toLocaleString(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 2,
            }
        );

    }


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <div className="app">

            {/* =========================
                NAVBAR
            ========================== */}

            <header className="navbar">

                <div className="logo">
                    Expense Reimbursement
                </div>

                <div className="nav-actions">

                    <span>
                        Approver
                    </span>

                    <button
                        className="btn btn-outline"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            {/* =========================
                MAIN
            ========================== */}

            <main>

                <section className="dashboard-section">

                    <div className="dashboard-header">

                        <div>

                            <p className="eyebrow">
                                APPROVER DASHBOARD
                            </p>

                            <h1>
                                Review Expense Reports
                            </h1>

                            <p>
                                Review, approve or reject
                                submitted reimbursement reports.
                            </p>

                        </div>

                        <div className="dashboard-actions">

                            <button
                                className="btn btn-outline"
                                onClick={loadReports}
                                disabled={loading || actionLoading}
                            >
                                Refresh
                            </button>

                            <button
                                className="btn btn-primary"
                                onClick={exportReports}
                                disabled={actionLoading}
                            >
                                Export CSV
                            </button>

                        </div>

                    </div>


                    {/* =========================
                        ALERTS
                    ========================== */}

                    {error && (

                        <div className="alert alert-error">
                            {error}
                        </div>

                    )}

                    {success && (

                        <div className="alert alert-success">
                            {success}
                        </div>

                    )}


                    {/* =========================
                        STATISTICS
                    ========================== */}

                    <div className="stats-grid">

                        <div className="stat-card">

                            <span>
                                Total Reports
                            </span>

                            <strong>
                                {totalReports}
                            </strong>

                        </div>


                        <div className="stat-card">

                            <span>
                                Submitted
                            </span>

                            <strong>
                                {submittedReports}
                            </strong>

                        </div>


                        <div className="stat-card">

                            <span>
                                Approved
                            </span>

                            <strong>
                                {approvedReports}
                            </strong>

                        </div>


                        <div className="stat-card">

                            <span>
                                Rejected
                            </span>

                            <strong>
                                {rejectedReports}
                            </strong>

                        </div>

                    </div>


                    {/* =========================
                        REPORTS SECTION
                    ========================== */}

                    <section className="reports-section">

                        <div className="section-heading">

                            <div>

                                <p className="eyebrow">
                                    EXPENSE REPORTS
                                </p>

                                <h2>
                                    Reports for Review
                                </h2>

                            </div>

                        </div>


                        {/* =========================
                            FILTERS
                        ========================== */}

                        <div className="filters">

                            <input
                                type="text"
                                placeholder="Search reports..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                            />

                            <select
                                value={statusFilter}
                                onChange={(event) =>
                                    setStatusFilter(event.target.value)
                                }
                            >

                                <option value="All">
                                    All Status
                                </option>

                                <option value="Submitted">
                                    Submitted
                                </option>

                                <option value="Approved">
                                    Approved
                                </option>

                                <option value="Rejected">
                                    Rejected
                                </option>

                                <option value="Draft">
                                    Draft
                                </option>

                            </select>

                        </div>


                        {/* =========================
                            BULK ACTIONS
                        ========================== */}

                        {selectedReports.length > 0 && (

                            <div className="bulk-actions">

                                <span>
                                    {selectedReports.length}
                                    {" "}
                                    report(s) selected
                                </span>

                                <div>

                                    <button
                                        className="btn btn-primary"
                                        onClick={handleBulkApprove}
                                        disabled={actionLoading}
                                    >
                                        Approve Selected
                                    </button>

                                    <button
                                        className="btn btn-danger"
                                        onClick={handleBulkReject}
                                        disabled={actionLoading}
                                    >
                                        Reject Selected
                                    </button>

                                </div>

                            </div>

                        )}


                        {/* =========================
                            LOADING
                        ========================== */}

                        {loading ? (

                            <div className="empty-state">

                                <h3>
                                    Loading reports...
                                </h3>

                                <p>
                                    Please wait.
                                </p>

                            </div>

                        ) : filteredReports.length === 0 ? (

                            <div className="empty-state">

                                <h3>
                                    No reports found
                                </h3>

                                <p>
                                    There are no reports matching
                                    your current filters.
                                </p>

                            </div>

                        ) : (

                            <div className="reports-table-wrapper">

                                <table className="reports-table">

                                    <thead>

                                        <tr>

                                            <th>

                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        filteredReports.length > 0 &&
                                                        selectedReports.length ===
                                                        filteredReports.length
                                                    }
                                                    onChange={
                                                        handleSelectAll
                                                    }
                                                />

                                            </th>

                                            <th>
                                                Report
                                            </th>

                                            <th>
                                                Employee
                                            </th>

                                            <th>
                                                Period
                                            </th>

                                            <th>
                                                Amount
                                            </th>

                                            <th>
                                                Status
                                            </th>

                                            <th>
                                                Actions
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {filteredReports.map(
                                            (report) => {

                                                const employeeName =
                                                    report.employee_name ||
                                                    report.owner_name ||
                                                    report.name ||
                                                    "Employee";

                                                const employeeEmail =
                                                    report.employee_email ||
                                                    report.owner_email ||
                                                    report.email ||
                                                    "";

                                                return (

                                                    <tr
                                                        key={report.id}
                                                    >

                                                        {/* CHECKBOX */}

                                                        <td>

                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    selectedReports.includes(
                                                                        report.id
                                                                    )
                                                                }
                                                                onChange={() =>
                                                                    handleSelectReport(
                                                                        report.id
                                                                    )
                                                                }
                                                            />

                                                        </td>


                                                        {/* REPORT */}

                                                        <td>

                                                            <strong>
                                                                {report.title ||
                                                                    `Report #${report.id}`}
                                                            </strong>

                                                            <small>
                                                                Report #{report.id}
                                                            </small>

                                                        </td>


                                                        {/* EMPLOYEE */}

                                                        <td>

                                                            <strong>
                                                                {employeeName}
                                                            </strong>

                                                            {employeeEmail && (

                                                                <small>
                                                                    {employeeEmail}
                                                                </small>

                                                            )}

                                                        </td>


                                                        {/* PERIOD */}

                                                        <td>

                                                            {report.start_date ||
                                                                report.end_date ? (

                                                                <>
                                                                    <div>
                                                                        {report.start_date ||
                                                                            "-"}
                                                                    </div>

                                                                    <div>
                                                                        to{" "}
                                                                        {report.end_date ||
                                                                            "-"}
                                                                    </div>
                                                                </>

                                                            ) : (

                                                                "-"

                                                            )}

                                                        </td>


                                                        {/* AMOUNT */}

                                                        <td>

                                                            <strong>
                                                                {formatAmount(
                                                                    report.total_amount
                                                                )}
                                                            </strong>

                                                        </td>


                                                        {/* STATUS */}

                                                        <td>

                                                            <span
                                                                className={`status ${
                                                                    String(
                                                                        report.status ||
                                                                        ""
                                                                    ).toLowerCase()
                                                                }`}
                                                            >
                                                                {report.status ||
                                                                    "Unknown"}
                                                            </span>

                                                        </td>


                                                        {/* ACTIONS */}

                                                        <td>

                                                            {report.status ===
                                                                "Submitted" ? (

                                                                <div className="action-buttons">

                                                                    <button
                                                                        className="btn btn-primary"
                                                                        onClick={() =>
                                                                            handleApprove(
                                                                                report.id
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            actionLoading
                                                                        }
                                                                    >
                                                                        Approve
                                                                    </button>

                                                                    <button
                                                                        className="btn btn-danger"
                                                                        onClick={() =>
                                                                            handleReject(
                                                                                report.id
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            actionLoading
                                                                        }
                                                                    >
                                                                        Reject
                                                                    </button>

                                                                </div>

                                                            ) : (

                                                                <span>
                                                                    No action
                                                                </span>

                                                            )}

                                                        </td>

                                                    </tr>

                                                );

                                            }
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </section>

                </section>

            </main>


            {/* =========================
                FOOTER
            ========================== */}

            <footer className="footer">

                <p>
                    Expense Reimbursement System
                </p>

                <p>
                    Approver Dashboard
                </p>

            </footer>

        </div>

    );

}

export default ApproverDashboard;