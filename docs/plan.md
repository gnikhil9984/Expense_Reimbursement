# Development Plan

## Project Goal

Build a full-stack Expense Reimbursement application with employee and
approver roles, expense report management, approval workflow, dashboard,
audit history, comments, alerts, and CSV export.

---

# Phase 1 — Project Setup

- [x] Create project repository
- [x] Initialize Git
- [x] Create frontend, backend, and docs structure
- [x] Add `.gitignore`
- [x] Initialize backend Node.js project

---

# Phase 2 — Backend Foundation

- [x] Install Express
- [x] Install PostgreSQL client
- [x] Configure environment variables
- [x] Configure CORS
- [x] Add development script with Nodemon
- [x] Create Express server
- [x] Create health check API
- [x] Create controller structure
- [x] Create route structure
- [x] Add 404 middleware
- [x] Add global error handler
- [x] Verify PostgreSQL connectivity

---

# Phase 3 — Database

- [x] Create Supabase PostgreSQL project
- [x] Create initial database migration
- [x] Create users table
- [x] Create expense reports table
- [x] Create expense lines table
- [x] Create report approvers table
- [x] Create status history table
- [x] Create comments table
- [x] Create alerts table
- [x] Add foreign keys
- [x] Add indexes
- [x] Add database constraints
- [x] Add immutable status history trigger
- [x] Verify schema
- [x] Verify foreign keys
- [x] Test status history immutability
- [x] Clean up test data

---

# Phase 4 — Authentication & Authorization

- [ ] Implement user registration
- [ ] Implement password hashing
- [ ] Implement login
- [ ] Implement authentication token/session handling
- [ ] Add authentication middleware
- [ ] Add role-based authorization
- [ ] Protect employee routes
- [ ] Protect approver routes
- [ ] Prevent unauthorized access
- [ ] Prevent approver self-approval

---

# Phase 5 — Expense Reports

- [ ] Create expense report
- [ ] Edit draft expense report
- [ ] Archive report
- [ ] Restore archived report
- [ ] Add expense lines
- [ ] Edit expense lines
- [ ] Delete expense lines
- [ ] Validate expense categories
- [ ] Validate expense amounts
- [ ] Calculate report total on server
- [ ] Implement report listing
- [ ] Implement report details

---

# Phase 6 — Approval Workflow

- [ ] Implement Draft → Submitted
- [ ] Implement Submitted → Approved
- [ ] Implement Submitted → Rejected
- [ ] Implement Approved → Paid
- [ ] Return rejected reports to Draft
- [ ] Require rejection reason
- [ ] Reject invalid status transitions
- [ ] Assign approvers to reports
- [ ] Support multiple approvers per report
- [ ] Show full submitted queue to approvers
- [ ] Show assigned report subset
- [ ] Prevent self-approval

---

# Phase 7 — Search, Filtering & Pagination

- [ ] Server-side report search
- [ ] Filter by status
- [ ] Filter by category
- [ ] Filter by date
- [ ] Pagination
- [ ] Validate pagination parameters

---

# Phase 8 — Bulk Actions & Export

- [ ] Bulk approve
- [ ] Bulk reject
- [ ] Return per-report results
- [ ] Handle self-approval attempts
- [ ] Export approved unpaid reports
- [ ] Generate CSV file

---

# Phase 9 — Dashboard

- [ ] Approval count
- [ ] Reimbursements due
- [ ] Approved this week
- [ ] Paid this week
- [ ] Status breakdown
- [ ] Category breakdown
- [ ] Weekly paid totals
- [ ] Eight-week paid trend

---

# Phase 10 — Comments & Audit History

- [ ] Add report comments
- [ ] Display comments
- [ ] Record status changes
- [ ] Display immutable status history
- [ ] Record rejection reasons

---

# Phase 11 — Stale Approval Alerts

- [ ] Detect stale submitted reports
- [ ] Create approver alerts
- [ ] Display alerts
- [ ] Implement dismiss functionality
- [ ] Implement alert reappearance logic
- [ ] Prevent unnecessary duplicate alerts

---

# Phase 12 — Frontend

- [ ] Create React + Vite application
- [ ] Create routing
- [ ] Create login/register screens
- [ ] Create employee dashboard
- [ ] Create report creation screen
- [ ] Create report details screen
- [ ] Create approver queue
- [ ] Create approval actions
- [ ] Create dashboard analytics UI
- [ ] Create comments UI
- [ ] Create alerts UI
- [ ] Add loading states
- [ ] Add error states
- [ ] Add form validation
- [ ] Add pagination UI

---

# Phase 13 — Testing

- [ ] Test authentication
- [ ] Test authorization
- [ ] Test report CRUD
- [ ] Test expense line calculations
- [ ] Test status transitions
- [ ] Test rejection workflow
- [ ] Test self-approval prevention
- [ ] Test bulk operations
- [ ] Test CSV export
- [ ] Test dashboard calculations
- [ ] Test comments
- [ ] Test immutable history
- [ ] Test alerts
- [ ] Test invalid requests
- [ ] Test edge cases

---

# Phase 14 — Deployment

- [ ] Prepare production environment variables
- [ ] Deploy backend to Render
- [ ] Deploy frontend to Vercel
- [ ] Configure Supabase production database
- [ ] Configure CORS
- [ ] Verify production API
- [ ] Verify production frontend
- [ ] Seed demo data
- [ ] Create demo credentials
- [ ] Test complete production workflow

---

# Phase 15 — Final Documentation

- [ ] Update architecture documentation
- [ ] Update database schema documentation
- [ ] Record engineering decisions
- [ ] Maintain AI prompts documentation
- [ ] Complete submission checklist
- [ ] Add GitHub repository URL
- [ ] Add live application URL
- [ ] Add demo credentials
- [ ] Add final project reflection