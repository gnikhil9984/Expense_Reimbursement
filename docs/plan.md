# Expense Reimbursement System — Development Plan

## Project Overview

The Expense Reimbursement System is a full-stack web application designed to manage employee expense reports and their approval workflow.

The application supports two primary roles:

- Employee
- Approver

Employees can create and manage expense reports, add expense lines, submit reports, and track their report status.

Approvers can view assigned submitted reports, search and filter reports, approve or reject reports, perform bulk actions, and export report data.

The application consists of:

- React + Vite frontend
- Node.js + Express backend
- PostgreSQL database hosted on Supabase
- JWT-based authentication
- Role-based authorization
- REST APIs
- Render deployment

---

# Phase 1 — Project Setup

- [x] Create project repository
- [x] Initialize Git repository
- [x] Create project structure
- [x] Create backend directory
- [x] Create frontend directory
- [x] Create documentation structure
- [x] Add `.gitignore`
- [x] Initialize Node.js backend
- [x] Initialize React + Vite frontend
- [x] Configure basic project scripts
- [x] Create initial Git commits

---

# Phase 2 — Backend Foundation & Database

## Backend Foundation

- [x] Install Express
- [x] Install PostgreSQL client (`pg`)
- [x] Install CORS
- [x] Install dotenv
- [x] Install JWT support
- [x] Install bcryptjs
- [x] Configure environment variables
- [x] Configure CORS
- [x] Configure JSON request handling
- [x] Add Nodemon development script
- [x] Create Express server
- [x] Create route structure
- [x] Create controller structure
- [x] Create middleware structure
- [x] Create health check API
- [x] Add 404 middleware
- [x] Add global error handler
- [x] Configure production server binding
- [x] Configure server to use Render's `PORT`

## Database

- [x] Create Supabase PostgreSQL database
- [x] Configure PostgreSQL connection
- [x] Create users table
- [x] Create expense reports table
- [x] Create expense lines table
- [x] Create report approvers table
- [x] Create status history table
- [x] Create comments table
- [x] Create alerts table
- [x] Add primary keys
- [x] Add foreign keys
- [x] Add database constraints
- [x] Add indexes
- [x] Verify database connectivity
- [x] Verify database schema

---

# Phase 3 — Authentication & Authorization

## Authentication

- [x] Implement user registration
- [x] Implement password hashing
- [x] Implement user login
- [x] Generate JWT authentication token
- [x] Implement authentication middleware
- [x] Implement current-user endpoint
- [x] Handle invalid authentication
- [x] Handle expired/invalid sessions

## Authorization

- [x] Implement role-based authorization
- [x] Create employee role protection
- [x] Create approver role protection
- [x] Protect report routes
- [x] Protect approver actions
- [x] Prevent unauthorized API access
- [x] Prevent approver self-approval

---

# Phase 4 — Expense Report Management

## Expense Reports

- [x] Create expense report
- [x] Create reports in Draft status
- [x] Edit draft expense reports
- [x] Archive reports
- [x] Restore archived reports
- [x] Retrieve employee reports
- [x] Retrieve report details
- [x] Validate report ownership
- [x] Validate report status before modification

## Expense Lines

- [x] Add expense lines
- [x] Edit expense lines
- [x] Delete expense lines
- [x] Store expense date
- [x] Store expense category
- [x] Store expense amount
- [x] Validate expense amount
- [x] Validate expense category
- [x] Calculate report totals
- [x] Return calculated report totals

---

# Phase 5 — Report Submission & Approval Workflow

## Report Submission

- [x] Implement Draft → Submitted transition
- [x] Validate report ownership before submission
- [x] Prevent submission of invalid reports
- [x] Record submission status change
- [x] Update report timestamps

## Approver Assignment

- [x] Assign approvers to reports
- [x] Store report approver relationships
- [x] Verify approver assignment before approval
- [x] Restrict approval to assigned approvers

## Approval

- [x] Implement Submitted → Approved transition
- [x] Prevent approval of non-submitted reports
- [x] Prevent self-approval
- [x] Record approval timestamp
- [x] Record approval status change

## Rejection

- [x] Implement Submitted → Rejected transition
- [x] Validate approver assignment
- [x] Prevent rejection of invalid report status
- [x] Store rejection information
- [x] Record rejection status change

---

# Phase 6 — Search, Filtering, Bulk Actions & Export

## Search & Filtering

- [x] Implement report search
- [x] Implement status filtering
- [x] Implement report listing
- [x] Validate search/filter parameters
- [x] Support approver report queue
- [x] Display submitted reports to approvers

## Bulk Actions

- [x] Implement bulk approve
- [x] Implement bulk reject
- [x] Validate bulk report IDs
- [x] Remove duplicate report IDs
- [x] Validate report assignment
- [x] Validate report status
- [x] Handle individual report results
- [x] Handle self-approval attempts
- [x] Record bulk status changes

## CSV Export

- [x] Implement report export API
- [x] Generate CSV output
- [x] Export applicable report data
- [x] Support frontend CSV download

---

# Phase 7 — Frontend Application

## React Application

- [x] Create React + Vite application
- [x] Configure frontend project
- [x] Configure frontend routing
- [x] Create application layout
- [x] Create reusable API request helper
- [x] Configure authentication token handling
- [x] Configure API error handling
- [x] Handle unauthorized responses

## Authentication UI

- [x] Create Home page
- [x] Create Login page
- [x] Create Register page
- [x] Implement login flow
- [x] Implement registration flow
- [x] Implement logout
- [x] Store authentication token
- [x] Handle session expiration

## Employee UI

- [x] Create Employee Dashboard
- [x] Display employee reports
- [x] Create report workflow
- [x] Display report details
- [x] Add expense lines
- [x] Edit expense lines
- [x] Delete expense lines
- [x] Submit reports
- [x] Display report statuses
- [x] Display report actions

## Approver UI

- [x] Create Approver Dashboard
- [x] Display submitted reports
- [x] Display assigned reports
- [x] Search reports
- [x] Filter reports
- [x] Select reports
- [x] Approve individual reports
- [x] Reject individual reports
- [x] Bulk approve reports
- [x] Bulk reject reports
- [x] Export reports
- [x] Display success messages
- [x] Display error messages
- [x] Add loading states

---

# Phase 8 — Testing & Integration

## Backend Testing

- [x] Test health check endpoint
- [x] Test database connection
- [x] Test registration
- [x] Test login
- [x] Test JWT authentication
- [x] Test role-based authorization
- [x] Test report creation
- [x] Test report editing
- [x] Test expense line operations
- [x] Test report submission
- [x] Test approver assignment
- [x] Test approval workflow
- [x] Test rejection workflow
- [x] Test self-approval prevention
- [x] Test bulk actions
- [x] Test CSV export
- [x] Test invalid requests
- [x] Test error handling

## Frontend Testing

- [x] Test login flow
- [x] Test registration flow
- [x] Test employee dashboard
- [x] Test report creation
- [x] Test expense line operations
- [x] Test report submission
- [x] Test approver dashboard
- [x] Test search
- [x] Test filtering
- [x] Test approval actions
- [x] Test rejection actions
- [x] Test bulk actions
- [x] Test CSV export
- [x] Test logout
- [x] Test unauthorized access handling

## Production Build Verification

- [x] Run frontend production build
- [x] Verify Vite production build
- [x] Verify generated `dist` directory
- [x] Verify frontend API configuration

---

# Phase 9 — Production Deployment

## Backend Deployment

- [x] Prepare backend for production
- [x] Configure `process.env.PORT`
- [x] Configure server to listen on `0.0.0.0`
- [x] Verify production start command
- [x] Configure Render backend service
- [x] Configure production environment variables
- [x] Configure `DATABASE_URL`
- [x] Configure `JWT_SECRET`
- [x] Configure production `PORT`
- [x] Deploy backend to Render
- [x] Verify backend deployment
- [x] Verify production health endpoint
- [x] Verify production database connectivity

## Frontend Deployment

- [x] Update frontend API base URL
- [x] Replace localhost backend URL with deployed Render backend URL
- [x] Build frontend successfully
- [x] Configure frontend production build
- [x] Deploy frontend
- [x] Verify frontend deployment
- [x] Verify frontend-to-backend communication

## Production Integration

- [x] Connect frontend to deployed backend
- [x] Connect backend to Supabase PostgreSQL
- [x] Verify authentication in production
- [x] Verify employee workflow in production
- [x] Verify approver workflow in production
- [x] Verify report creation
- [x] Verify report submission
- [x] Verify approval/rejection functionality
- [x] Verify search and filtering
- [x] Verify bulk actions
- [x] Verify CSV export

---

# Phase 10 — Final Documentation & Submission

## Documentation

- [x] Update project README
- [x] Update development plan
- [x] Document project architecture
- [x] Document database structure
- [x] Document API functionality
- [x] Document authentication and authorization
- [x] Document frontend structure
- [x] Document deployment process
- [x] Document production URLs
- [x] Document Git workflow
- [x] Maintain project documentation in `.md` files

## Git & Repository

- [x] Commit completed Phase 9 implementation
- [x] Push Phase 9 changes to GitHub
- [x] Commit production backend preparation
- [x] Push backend deployment changes
- [x] Commit frontend production API configuration
- [x] Push frontend deployment changes
- [x] Verify clean Git working tree
- [x] Verify latest commits on `main`

## Final Verification

- [x] Verify live frontend
- [x] Verify live backend
- [x] Verify production API
- [x] Verify database connectivity
- [x] Verify complete employee workflow
- [x] Verify complete approver workflow
- [x] Verify all implemented major functionalities
- [x] Verify production application from browser

---

# Current Project Status

The Expense Reimbursement System has completed the planned 10-phase development process.

```text
Phase 1  — Project Setup                         COMPLETE
Phase 2  — Backend & Database                    COMPLETE
Phase 3  — Authentication & Authorization        COMPLETE
Phase 4  — Expense Report Management             COMPLETE
Phase 5  — Submission & Approval Workflow        COMPLETE
Phase 6  — Search, Bulk Actions & Export         COMPLETE
Phase 7  — Frontend Application                  COMPLETE
Phase 8  — Testing & Integration                 COMPLETE
Phase 9  — Production Deployment                 COMPLETE
Phase 10 — Documentation & Submission            COMPLETE