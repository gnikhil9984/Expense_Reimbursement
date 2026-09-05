import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ApproverDashboard from "./pages/ApproverDashboard";
import ReportDetails from "./pages/ReportDetails";

function Home() {
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
          <Link
            to="/login"
            className="btn btn-outline"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="btn btn-primary"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main>
        {/* =========================
            HERO SECTION
        ========================== */}
        <section className="hero-section">
          <div className="hero-content">
            <p className="eyebrow">
              EXPENSE MANAGEMENT SYSTEM
            </p>

            <h1>
              Manage your expenses
              <br />
              <span>simply and efficiently.</span>
            </h1>

            <p className="hero-description">
              Create, submit, track and manage your expense
              reimbursement reports from one place.
            </p>

            <div className="hero-actions">
              <Link
                to="/register"
                className="btn btn-primary btn-large"
              >
                Get Started
              </Link>

              <Link
                to="/login"
                className="btn btn-outline btn-large"
              >
                Login
              </Link>
            </div>
          </div>

          {/* =========================
              DEMO REPORT CARD
          ========================== */}
          <div className="hero-card">
            <div className="card-header">
              <div>
                <p>Expense Report</p>

                <h3>
                  September Business Travel
                </h3>
              </div>

              <span className="status approved">
                Approved
              </span>
            </div>

            <div className="expense-summary">
              <span>Total Amount</span>

              <strong>
                ₹5,500.00
              </strong>
            </div>

            <div className="expense-row">
              <span>Travel</span>

              <span>
                ₹3,500.00
              </span>
            </div>

            <div className="expense-row">
              <span>Food</span>

              <span>
                ₹2,000.00
              </span>
            </div>

            <div className="progress-section">
              <div className="progress-label">
                <span>
                  Report Status
                </span>

                <span>
                  Approved
                </span>
              </div>

              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            FEATURES SECTION
        ========================== */}
        <section className="features-section">
          <div className="section-heading">
            <p className="eyebrow">
              FEATURES
            </p>

            <h2>
              Everything you need to manage
              <br />
              expense reimbursements.
            </h2>
          </div>

          <div className="features-grid">

            {/* Feature 01 */}
            <div className="feature-card">
              <div className="feature-icon">
                01
              </div>

              <h3>
                Create Reports
              </h3>

              <p>
                Create expense reports and add
                individual expense lines with
                categories, dates and amounts.
              </p>
            </div>

            {/* Feature 02 */}
            <div className="feature-card">
              <div className="feature-icon">
                02
              </div>

              <h3>
                Submit & Track
              </h3>

              <p>
                Submit your reports and easily
                track their status throughout
                the reimbursement process.
              </p>
            </div>

            {/* Feature 03 */}
            <div className="feature-card">
              <div className="feature-icon">
                03
              </div>

              <h3>
                Approval Workflow
              </h3>

              <p>
                Approvers can review assigned
                reports and approve or reject
                them with proper authorization.
              </p>
            </div>

            {/* Feature 04 */}
            <div className="feature-card">
              <div className="feature-icon">
                04
              </div>

              <h3>
                CSV Export
              </h3>

              <p>
                Export approved and unpaid
                expense reports for further
                processing and reimbursement.
              </p>
            </div>

          </div>
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
          Phase 9 — Dashboard & Frontend
        </p>
      </footer>
    </div>
  );
}


/* =========================================
   MAIN APP
========================================= */

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing Page */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Authentication */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Employee */}
        <Route
          path="/employee"
          element={<EmployeeDashboard />}
        />

        <Route
          path="/employee/reports/:id"
          element={<ReportDetails />}
        />

        {/* Approver */}
        <Route
          path="/approver"
          element={<ApproverDashboard />}
        />

        {/* Invalid URL */}
        <Route
          path="*"
          element={<Home />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;