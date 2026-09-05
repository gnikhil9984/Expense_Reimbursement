import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
    getReportDetails,
    addExpenseLine,
    updateExpenseLine,
    deleteExpenseLine,
    submitReport,
    updateReport,
} from "../api/api";

import "../App.css";


function ReportDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [saving, setSaving] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Report edit
    const [editingReport, setEditingReport] = useState(false);

    const [reportForm, setReportForm] = useState({
        title: "",
        start_date: "",
        end_date: "",
    });

    // Expense form
    const [showExpenseForm, setShowExpenseForm] = useState(false);

    const [editingExpenseId, setEditingExpenseId] = useState(null);

    const [expenseForm, setExpenseForm] = useState({
        expense_date: "",
        amount: "",
        category: "",
        description: "",
    });


    const categories = [
        "Travel",
        "Meals",
        "Supplies",
        "Accommodation",
        "Other",
    ];


    // ==========================================
    // LOAD REPORT
    // ==========================================

    async function loadReport() {
        try {
            setLoading(true);
            setError("");

            const response = await getReportDetails(id);

            console.log("Report details:", response);

            const data = response?.report || response?.data || response;

            setReport(data);

            setReportForm({
                title: data?.title || "",
                start_date: data?.start_date
                    ? String(data.start_date).slice(0, 10)
                    : "",
                end_date: data?.end_date
                    ? String(data.end_date).slice(0, 10)
                    : "",
            });

        } catch (err) {
            console.error("Load report error:", err);

            setError(
                err.message || "Failed to load report."
            );
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        loadReport();
    }, [id]);


    // ==========================================
    // REPORT FORM
    // ==========================================

    function handleReportChange(event) {
        const { name, value } = event.target;

        setReportForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    }


    async function handleUpdateReport(event) {
        event.preventDefault();

        if (!reportForm.title.trim()) {
            setError("Report title is required.");
            return;
        }

        if (!reportForm.start_date || !reportForm.end_date) {
            setError("Start date and end date are required.");
            return;
        }

        if (reportForm.end_date < reportForm.start_date) {
            setError("End date cannot be before start date.");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            await updateReport(
                id,
                reportForm.title.trim(),
                reportForm.start_date,
                reportForm.end_date
            );

            setSuccess("Report updated successfully.");

            setEditingReport(false);

            await loadReport();

        } catch (err) {
            console.error("Update report error:", err);

            setError(
                err.message || "Failed to update report."
            );
        } finally {
            setSaving(false);
        }
    }


    // ==========================================
    // EXPENSE FORM
    // ==========================================

    function resetExpenseForm() {
        setExpenseForm({
            expense_date: "",
            amount: "",
            category: "",
            description: "",
        });

        setEditingExpenseId(null);
        setShowExpenseForm(false);
    }


    function handleExpenseChange(event) {
        const { name, value } = event.target;

        setExpenseForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    }


    // ==========================================
    // ADD / UPDATE EXPENSE
    // ==========================================

    async function handleExpenseSubmit(event) {
        event.preventDefault();

        setError("");
        setSuccess("");

        const {
            expense_date,
            amount,
            category,
            description,
        } = expenseForm;


        if (!expense_date) {
            setError("Expense date is required.");
            return;
        }

        if (!amount || Number(amount) <= 0) {
            setError("Expense amount must be greater than 0.");
            return;
        }

        if (!category) {
            setError("Please select an expense category.");
            return;
        }

        if (!description.trim()) {
            setError("Expense description is required.");
            return;
        }


        try {
            setSaving(true);

            if (editingExpenseId) {

                await updateExpenseLine(
                    id,
                    editingExpenseId,
                    {
                        expense_date,
                        amount: Number(amount),
                        category,
                        description: description.trim(),
                    }
                );

                setSuccess(
                    "Expense line updated successfully."
                );

            } else {

                await addExpenseLine(
                    id,
                    {
                        expense_date,
                        amount: Number(amount),
                        category,
                        description: description.trim(),
                    }
                );

                setSuccess(
                    "Expense line added successfully."
                );
            }

            resetExpenseForm();

            await loadReport();

        } catch (err) {
            console.error("Expense save error:", err);

            setError(
                err.message || "Failed to save expense."
            );
        } finally {
            setSaving(false);
        }
    }


    // ==========================================
    // EDIT EXPENSE
    // ==========================================

    function handleEditExpense(expense) {
        setEditingExpenseId(expense.id);

        setExpenseForm({
            expense_date: expense.expense_date
                ? String(expense.expense_date).slice(0, 10)
                : "",
            amount: expense.amount || "",
            category: expense.category || "",
            description: expense.description || "",
        });

        setShowExpenseForm(true);

        window.scrollTo({
            top: 400,
            behavior: "smooth",
        });
    }


    // ==========================================
    // DELETE EXPENSE
    // ==========================================

    async function handleDeleteExpense(expenseId) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this expense?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await deleteExpenseLine(
                id,
                expenseId
            );

            setSuccess(
                "Expense line deleted successfully."
            );

            await loadReport();

        } catch (err) {
            console.error("Delete expense error:", err);

            setError(
                err.message || "Failed to delete expense."
            );
        }
    }


    // ==========================================
    // SUBMIT REPORT
    // ==========================================

    async function handleSubmitReport() {
        if (isSubmitting) {
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to submit this report for approval?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setIsSubmitting(true);
            setError("");
            setSuccess("");

            await submitReport(id);

            setSuccess(
                "Report submitted successfully."
            );

            await loadReport();

        } catch (err) {
            console.error("Submit report error:", err);

            setError(
                err.message || "Failed to submit report."
            );
        } finally {
            setIsSubmitting(false);
        }
    }


    // ==========================================
    // FORMAT
    // ==========================================

    function formatDate(value) {
        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }


    function formatAmount(value) {
        return Number(value || 0).toLocaleString(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 2,
            }
        );
    }


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="dashboard-page">
                <main className="dashboard-container">
                    <div className="empty-state">
                        <h2>Loading report...</h2>
                    </div>
                </main>
            </div>
        );
    }


    if (!report) {
        return (
            <div className="dashboard-page">
                <main className="dashboard-container">
                    <div className="alert alert-error">
                        {error || "Report not found."}
                    </div>

                    <Link
                        to="/employee"
                        className="btn btn-outline"
                    >
                        ← Back to Dashboard
                    </Link>
                </main>
            </div>
        );
    }


    const status = String(
        report.status || "Draft"
    ).toLowerCase();

    const isDraft = status === "draft";
    const isRejected = status === "rejected";
    const isEditable = isDraft || isRejected;

    const expenses = Array.isArray(report.expenses)
        ? report.expenses
        : [];


    return (
        <div className="dashboard-page">

            {/* ======================================
                NAVBAR
            ======================================= */}

            <header className="dashboard-navbar">

                <div className="dashboard-logo">
                    Expense Reimbursement
                </div>

                <Link
                    to="/employee"
                    className="btn btn-outline"
                >
                    ← Dashboard
                </Link>

            </header>


            <main className="dashboard-container">

                {/* ======================================
                    BACK
                ======================================= */}

                <div style={{ marginBottom: "24px" }}>
                    <Link to="/employee">
                        ← Back to My Reports
                    </Link>
                </div>


                {/* ======================================
                    ALERTS
                ======================================= */}

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


                {/* ======================================
                    REPORT HEADER
                ======================================= */}

                <section className="reports-section">

                    <div className="reports-header">

                        <div>

                            <p className="eyebrow">
                                EXPENSE REPORT
                            </p>

                            <h1>
                                {report.title}
                            </h1>

                            <p>
                                Report #{report.id}
                            </p>

                        </div>

                        <span className={`status ${status}`}>
                            {report.status}
                        </span>

                    </div>


                    {/* ==================================
                        REPORT INFORMATION
                    =================================== */}

                    {!editingReport ? (

                        <div className="stat-card">

                            <p>
                                <strong>Period:</strong>{" "}
                                {formatDate(report.start_date)}
                                {" — "}
                                {formatDate(report.end_date)}
                            </p>

                            <p>
                                <strong>Total:</strong>{" "}
                                {formatAmount(
                                    report.total_amount
                                )}
                            </p>

                            {isEditable && (
                                <button
                                    className="btn btn-outline"
                                    onClick={() =>
                                        setEditingReport(true)
                                    }
                                >
                                    Edit Report
                                </button>
                            )}

                        </div>

                    ) : (

                        <form
                            onSubmit={handleUpdateReport}
                            className="stat-card"
                        >

                            <div className="form-group">
                                <label>
                                    Report Title
                                </label>

                                <input
                                    name="title"
                                    value={reportForm.title}
                                    onChange={handleReportChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Start Date
                                </label>

                                <input
                                    type="date"
                                    name="start_date"
                                    value={reportForm.start_date}
                                    onChange={handleReportChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    End Date
                                </label>

                                <input
                                    type="date"
                                    name="end_date"
                                    value={reportForm.end_date}
                                    onChange={handleReportChange}
                                />
                            </div>

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() =>
                                        setEditingReport(false)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>

                            </div>

                        </form>
                    )}

                </section>


                {/* ======================================
                    EXPENSE LINES
                ======================================= */}

                <section className="reports-section">

                    <div className="reports-header">

                        <div>
                            <h2>
                                Expense Lines
                            </h2>

                            <p>
                                Add and manage individual expenses.
                            </p>
                        </div>


                        {isEditable && (
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    resetExpenseForm();
                                    setShowExpenseForm(true);
                                }}
                            >
                                + Add Expense
                            </button>
                        )}

                    </div>


                    {/* ==================================
                        EXPENSE FORM
                    =================================== */}

                    {showExpenseForm && isEditable && (

                        <form
                            onSubmit={handleExpenseSubmit}
                            className="stat-card"
                            style={{ marginBottom: "24px" }}
                        >

                            <h3>
                                {editingExpenseId
                                    ? "Edit Expense"
                                    : "Add Expense"}
                            </h3>


                            <div className="form-group">

                                <label>
                                    Expense Date
                                </label>

                                <input
                                    type="date"
                                    name="expense_date"
                                    value={expenseForm.expense_date}
                                    onChange={handleExpenseChange}
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Amount
                                </label>

                                <input
                                    type="number"
                                    name="amount"
                                    min="0.01"
                                    step="0.01"
                                    placeholder="Enter amount"
                                    value={expenseForm.amount}
                                    onChange={handleExpenseChange}
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Category
                                </label>

                                <select
                                    name="category"
                                    value={expenseForm.category}
                                    onChange={handleExpenseChange}
                                >

                                    <option value="">
                                        Select category
                                    </option>

                                    {categories.map(
                                        (category) => (
                                            <option
                                                key={category}
                                                value={category}
                                            >
                                                {category}
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>


                            <div className="form-group">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    placeholder="Describe this expense"
                                    value={expenseForm.description}
                                    onChange={handleExpenseChange}
                                    rows="3"
                                />

                            </div>


                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={resetExpenseForm}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingExpenseId
                                            ? "Update Expense"
                                            : "Add Expense"}
                                </button>

                            </div>

                        </form>
                    )}


                    {/* ==================================
                        EXPENSE TABLE
                    =================================== */}

                    {expenses.length === 0 ? (

                        <div className="empty-state">

                            <h3>
                                No expenses added yet
                            </h3>

                            <p>
                                Add your first expense line
                                to this report.
                            </p>

                        </div>

                    ) : (

                        <div className="table-wrapper">

                            <table className="reports-table">

                                <thead>

                                    <tr>
                                        <th>Date</th>
                                        <th>Category</th>
                                        <th>Description</th>
                                        <th>Amount</th>

                                        {isEditable && (
                                            <th>Actions</th>
                                        )}
                                    </tr>

                                </thead>


                                <tbody>

                                    {expenses.map(
                                        (expense) => (

                                            <tr
                                                key={expense.id}
                                            >

                                                <td>
                                                    {formatDate(
                                                        expense.expense_date
                                                    )}
                                                </td>

                                                <td>
                                                    {expense.category}
                                                </td>

                                                <td>
                                                    {expense.description}
                                                </td>

                                                <td>
                                                    {formatAmount(
                                                        expense.amount
                                                    )}
                                                </td>

                                                {isEditable && (
                                                    <td>

                                                        <button
                                                            className="btn btn-small btn-outline"
                                                            onClick={() =>
                                                                handleEditExpense(
                                                                    expense
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        {" "}

                                                        <button
                                                            className="btn btn-small btn-danger"
                                                            onClick={() =>
                                                                handleDeleteExpense(
                                                                    expense.id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                    </td>
                                                )}

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}


                    {/* ==================================
                        TOTAL
                    =================================== */}

                    <div
                        className="stat-card"
                        style={{
                            marginTop: "24px",
                            textAlign: "right",
                        }}
                    >

                        <span className="stat-label">
                            Total Reimbursement
                        </span>

                        <strong className="stat-value">
                            {formatAmount(
                                report.total_amount
                            )}
                        </strong>

                    </div>


                    {/* ==================================
                        SUBMIT
                    =================================== */}

                    {(isDraft || isRejected) && (
                        <div
                            style={{
                                marginTop: "24px",
                                textAlign: "right",
                            }}
                        >

                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleSubmitReport}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Submitting..." : "Submit for Approval"}
                            </button>

                        </div>
                    )}

                </section>

            </main>

        </div>
    );
}

export default ReportDetails;