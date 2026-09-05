import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
    getReports,
    createReport,
    submitReport,
    archiveReport,
    restoreReport,
    logoutUser,
} from "../api/api";

import "../App.css";


function EmployeeDashboard() {
    const navigate = useNavigate();

    /* =====================================================
       USER
    ===================================================== */

    const storedUser = localStorage.getItem("user");

    let user = null;

    try {
        user = storedUser
            ? JSON.parse(storedUser)
            : null;
    } catch (error) {
        console.error("Invalid user data:", error);
    }


    /* =====================================================
       STATE
    ===================================================== */

    const [reports, setReports] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");


    /* =====================================================
       CREATE REPORT MODAL
    ===================================================== */

    const [showCreateModal, setShowCreateModal] =
        useState(false);

    const [creating, setCreating] = useState(false);

    const [createError, setCreateError] =
        useState("");

    const [reportForm, setReportForm] = useState({
        title: "",
        start_date: "",
        end_date: "",
    });


    /* =====================================================
       LOAD REPORTS
    ===================================================== */

    async function loadReports() {
        try {
            setLoading(true);
            setError("");

            const response = await getReports();

            console.log(
                "Reports API response:",
                response
            );

            /*
             * Backend response can be:
             *
             * {
             *   reports: [...]
             * }
             *
             * or
             *
             * {
             *   data: [...]
             * }
             *
             * or directly:
             *
             * [...]
             */

            let reportList = [];

            if (Array.isArray(response)) {
                reportList = response;
            } else if (
                Array.isArray(response?.reports)
            ) {
                reportList = response.reports;
            } else if (
                Array.isArray(response?.data)
            ) {
                reportList = response.data;
            }

            setReports(reportList);

        } catch (err) {
            console.error(
                "Load reports error:",
                err
            );

            setError(
                err.message ||
                "Failed to load reports."
            );

        } finally {
            setLoading(false);
        }
    }


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {
        const token =
            localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        loadReports();
    }, []);


    /* =====================================================
       CLEAR MESSAGES
    ===================================================== */

    function clearMessages() {
        setError("");
        setSuccess("");
    }


    /* =====================================================
       LOGOUT
    ===================================================== */

    function handleLogout() {
        logoutUser();

        navigate("/login");
    }


    /* =====================================================
       CREATE FORM CHANGE
    ===================================================== */

    function handleCreateChange(event) {
        const {
            name,
            value,
        } = event.target;

        setReportForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setCreateError("");
    }


    /* =====================================================
       CREATE REPORT
    ===================================================== */

    async function handleCreateReport(event) {
        event.preventDefault();

        setCreateError("");
        setSuccess("");

        const {
            title,
            start_date,
            end_date,
        } = reportForm;


        /* -----------------------------------------------
           Validation
        ------------------------------------------------ */

        if (!title.trim()) {
            setCreateError(
                "Report title is required."
            );

            return;
        }

        if (!start_date) {
            setCreateError(
                "Start date is required."
            );

            return;
        }

        if (!end_date) {
            setCreateError(
                "End date is required."
            );

            return;
        }

        if (end_date < start_date) {
            setCreateError(
                "End date cannot be before start date."
            );

            return;
        }


        try {
            setCreating(true);

            await createReport(
                title.trim(),
                start_date,
                end_date
            );

            setSuccess(
                "Expense report created successfully."
            );

            setReportForm({
                title: "",
                start_date: "",
                end_date: "",
            });

            setShowCreateModal(false);

            await loadReports();

        } catch (err) {
            console.error(
                "Create report error:",
                err
            );

            setCreateError(
                err.message ||
                "Failed to create report."
            );

        } finally {
            setCreating(false);
        }
    }


    /* =====================================================
       SUBMIT REPORT
    ===================================================== */

    async function handleSubmitReport(reportId) {
        const confirmed =
            window.confirm(
                "Are you sure you want to submit this report for approval?"
            );

        if (!confirmed) {
            return;
        }

        try {
            clearMessages();

            await submitReport(reportId);

            setSuccess(
                "Report submitted successfully."
            );

            await loadReports();

        } catch (err) {
            console.error(
                "Submit report error:",
                err
            );

            setError(
                err.message ||
                "Failed to submit report."
            );
        }
    }


    /* =====================================================
       ARCHIVE REPORT
    ===================================================== */

    async function handleArchiveReport(reportId) {
        const confirmed =
            window.confirm(
                "Are you sure you want to archive this report?"
            );

        if (!confirmed) {
            return;
        }

        try {
            clearMessages();

            await archiveReport(reportId);

            setSuccess(
                "Report archived successfully."
            );

            await loadReports();

        } catch (err) {
            console.error(
                "Archive report error:",
                err
            );

            setError(
                err.message ||
                "Failed to archive report."
            );
        }
    }


    /* =====================================================
       RESTORE REPORT
    ===================================================== */

    async function handleRestoreReport(reportId) {
        try {
            clearMessages();

            await restoreReport(reportId);

            setSuccess(
                "Report restored successfully."
            );

            await loadReports();

        } catch (err) {
            console.error(
                "Restore report error:",
                err
            );

            setError(
                err.message ||
                "Failed to restore report."
            );
        }
    }


    /* =====================================================
       FILTER REPORTS
    ===================================================== */

    const filteredReports = useMemo(() => {
        return reports.filter((report) => {

            const title =
                report.title ||
                report.report_title ||
                "";

            const status =
                report.status ||
                "";

            const matchesSearch =
                title
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    );

            const matchesStatus =
                statusFilter === "All" ||
                status.toLowerCase() ===
                    statusFilter.toLowerCase();

            return (
                matchesSearch &&
                matchesStatus
            );
        });

    }, [
        reports,
        search,
        statusFilter,
    ]);


    /* =====================================================
       STATISTICS
    ===================================================== */

    const totalReports =
        reports.length;

    const draftReports =
        reports.filter(
            (report) =>
                String(report.status)
                    .toLowerCase() === "draft"
        ).length;

    const submittedReports =
        reports.filter(
            (report) =>
                String(report.status)
                    .toLowerCase() === "submitted"
        ).length;

    const approvedReports =
        reports.filter(
            (report) =>
                String(report.status)
                    .toLowerCase() === "approved"
        ).length;

    const rejectedReports =
        reports.filter(
            (report) =>
                String(report.status)
                    .toLowerCase() === "rejected"
        ).length;


    /* =====================================================
       FORMAT DATE
    ===================================================== */

    function formatDate(dateValue) {
        if (!dateValue) {
            return "-";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return dateValue;
        }

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    }


    /* =====================================================
       FORMAT AMOUNT
    ===================================================== */

    function formatAmount(amount) {
        const value =
            Number(amount) || 0;

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
       STATUS CLASS
    ===================================================== */

    function getStatusClass(status) {
        const normalized =
            String(status || "")
                .toLowerCase();

        if (normalized === "approved") {
            return "status approved";
        }

        if (normalized === "submitted") {
            return "status submitted";
        }

        if (normalized === "rejected") {
            return "status rejected";
        }

        if (
            normalized === "archived"
        ) {
            return "status archived";
        }

        return "status draft";
    }


    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div className="dashboard-page">

            {/* =================================================
                NAVBAR
            ================================================= */}

            <header className="dashboard-navbar">

                <div className="dashboard-logo">
                    Expense Reimbursement
                </div>


                <div className="dashboard-nav-right">

                    <div className="user-info">

                        <span className="user-name">
                            {user?.name || "Employee"}
                        </span>

                        <span className="user-role">
                            Employee
                        </span>

                    </div>


                    <button
                        className="btn btn-outline"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="dashboard-container">


                {/* =============================================
                    HEADER
                ============================================== */}

                <section className="dashboard-header">

                    <div>

                        <p className="eyebrow">
                            EMPLOYEE DASHBOARD
                        </p>

                        <h1>
                            Welcome back,
                            {" "}
                            {user?.name ||
                                "Employee"}
                        </h1>

                        <p>
                            Create and manage your
                            expense reimbursement
                            reports.
                        </p>

                    </div>


                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setCreateError("");
                            setShowCreateModal(true);
                        }}
                    >
                        + Create Report
                    </button>

                </section>


                {/* =============================================
                    ALERTS
                ============================================== */}

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


                {/* =============================================
                    STATISTICS
                ============================================== */}

                <section className="stats-grid">

                    <div className="stat-card">

                        <span className="stat-label">
                            Total Reports
                        </span>

                        <strong className="stat-value">
                            {totalReports}
                        </strong>

                    </div>


                    <div className="stat-card">

                        <span className="stat-label">
                            Draft
                        </span>

                        <strong className="stat-value">
                            {draftReports}
                        </strong>

                    </div>


                    <div className="stat-card">

                        <span className="stat-label">
                            Submitted
                        </span>

                        <strong className="stat-value">
                            {submittedReports}
                        </strong>

                    </div>


                    <div className="stat-card">

                        <span className="stat-label">
                            Approved
                        </span>

                        <strong className="stat-value">
                            {approvedReports}
                        </strong>

                    </div>


                    <div className="stat-card">

                        <span className="stat-label">
                            Rejected
                        </span>

                        <strong className="stat-value">
                            {rejectedReports}
                        </strong>

                    </div>

                </section>


                {/* =============================================
                    REPORTS SECTION
                ============================================== */}

                <section className="reports-section">

                    <div className="reports-header">

                        <div>

                            <h2>
                                My Expense Reports
                            </h2>

                            <p>
                                View and manage your
                                reimbursement reports.
                            </p>

                        </div>


                        <button
                            className="btn btn-outline"
                            onClick={loadReports}
                            disabled={loading}
                        >
                            {loading
                                ? "Refreshing..."
                                : "Refresh"}
                        </button>

                    </div>


                    {/* =========================================
                        SEARCH + FILTER
                    ========================================== */}

                    <div className="reports-filters">

                        <input
                            type="text"
                            placeholder="Search reports..."
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                        />


                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(
                                    event.target.value
                                )
                            }
                        >

                            <option value="All">
                                All Status
                            </option>

                            <option value="Draft">
                                Draft
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

                            <option value="Archived">
                                Archived
                            </option>

                        </select>

                    </div>


                    {/* =========================================
                        LOADING
                    ========================================== */}

                    {loading ? (

                        <div className="empty-state">

                            <h3>
                                Loading reports...
                            </h3>

                            <p>
                                Please wait while we
                                fetch your reports.
                            </p>

                        </div>

                    ) : filteredReports.length === 0 ? (

                        /* =====================================
                           EMPTY
                        ====================================== */

                        <div className="empty-state">

                            <h3>
                                No reports found
                            </h3>

                            <p>
                                {search ||
                                statusFilter !== "All"
                                    ? "Try changing your search or filter."
                                    : "You have not created any expense reports yet."}
                            </p>


                            {!search &&
                                statusFilter ===
                                    "All" && (

                                <button
                                    className="btn btn-primary"
                                    onClick={() =>
                                        setShowCreateModal(
                                            true
                                        )
                                    }
                                >
                                    Create Your First Report
                                </button>

                            )}

                        </div>

                    ) : (

                        /* =====================================
                           REPORT TABLE
                        ====================================== */

                        <div className="table-wrapper">

                            <table className="reports-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Report
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

                                            const reportId =
                                                report.id ||
                                                report.report_id;

                                            const title =
                                                report.title ||
                                                report.report_title ||
                                                "Untitled Report";

                                            const status =
                                                report.status ||
                                                "Draft";

                                            const amount =
                                                report.total_amount ??
                                                report.total ??
                                                report.amount ??
                                                0;

                                            return (

                                                <tr
                                                    key={
                                                        reportId
                                                    }
                                                >

                                                    <td>

                                                        <strong>
                                                            {title}
                                                        </strong>

                                                        <small>
                                                            Report #
                                                            {reportId}
                                                        </small>

                                                    </td>


                                                    <td>

                                                        {formatDate(
                                                            report.start_date
                                                        )}

                                                        {" — "}

                                                        {formatDate(
                                                            report.end_date
                                                        )}

                                                    </td>


                                                    <td>

                                                        {formatAmount(
                                                            amount
                                                        )}

                                                    </td>


                                                    <td>

                                                        <span
                                                            className={getStatusClass(
                                                                status
                                                            )}
                                                        >
                                                            {status}
                                                        </span>

                                                    </td>


                                                    <td>

                                                        <div className="table-actions">

                                                            <Link
                                                                to={`/employee/reports/${reportId}`}
                                                                className="btn btn-small btn-outline"
                                                            >
                                                                View
                                                            </Link>


                                                            {String(
                                                                status
                                                            ).toLowerCase() ===
                                                                "draft" && (

                                                                <>

                                                                    <button
                                                                        className="btn btn-small btn-primary"
                                                                        onClick={() =>
                                                                            handleSubmitReport(
                                                                                reportId
                                                                            )
                                                                        }
                                                                    >
                                                                        Submit
                                                                    </button>


                                                                    <button
                                                                        className="btn btn-small btn-danger"
                                                                        onClick={() =>
                                                                            handleArchiveReport(
                                                                                reportId
                                                                            )
                                                                        }
                                                                    >
                                                                        Archive
                                                                    </button>

                                                                </>

                                                            )}


                                                            {String(
                                                                status
                                                            ).toLowerCase() ===
                                                                "archived" && (

                                                                <button
                                                                    className="btn btn-small btn-outline"
                                                                    onClick={() =>
                                                                        handleRestoreReport(
                                                                            reportId
                                                                        )
                                                                    }
                                                                >
                                                                    Restore
                                                                </button>

                                                            )}

                                                        </div>

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

            </main>


            {/* =================================================
                CREATE REPORT MODAL
            ================================================= */}

            {showCreateModal && (

                <div
                    className="modal-overlay"
                    onClick={() =>
                        setShowCreateModal(false)
                    }
                >

                    <div
                        className="create-report-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <button
                            className="close-button"
                            onClick={() =>
                                setShowCreateModal(
                                    false
                                )
                            }
                        >
                            ×
                        </button>


                        <p className="eyebrow">
                            NEW EXPENSE REPORT
                        </p>


                        <h2>
                            Create Report
                        </h2>


                        <p className="modal-description">
                            Create a new expense report.
                            You can add expense lines
                            after creating it.
                        </p>


                        {createError && (

                            <div className="alert alert-error">
                                {createError}
                            </div>

                        )}


                        <form
                            onSubmit={
                                handleCreateReport
                            }
                        >

                            {/* Title */}

                            <div className="form-group">

                                <label htmlFor="title">
                                    Report Title
                                </label>

                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    placeholder="e.g. September Business Travel"
                                    value={
                                        reportForm.title
                                    }
                                    onChange={
                                        handleCreateChange
                                    }
                                    disabled={
                                        creating
                                    }
                                />

                            </div>


                            {/* Start Date */}

                            <div className="form-group">

                                <label htmlFor="start_date">
                                    Start Date
                                </label>

                                <input
                                    id="start_date"
                                    name="start_date"
                                    type="date"
                                    value={
                                        reportForm.start_date
                                    }
                                    onChange={
                                        handleCreateChange
                                    }
                                    disabled={
                                        creating
                                    }
                                />

                            </div>


                            {/* End Date */}

                            <div className="form-group">

                                <label htmlFor="end_date">
                                    End Date
                                </label>

                                <input
                                    id="end_date"
                                    name="end_date"
                                    type="date"
                                    value={
                                        reportForm.end_date
                                    }
                                    onChange={
                                        handleCreateChange
                                    }
                                    disabled={
                                        creating
                                    }
                                />

                            </div>


                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() =>
                                        setShowCreateModal(
                                            false
                                        )
                                    }
                                    disabled={
                                        creating
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={
                                        creating
                                    }
                                >
                                    {creating
                                        ? "Creating..."
                                        : "Create Report"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default EmployeeDashboard;