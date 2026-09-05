# Architecture

## Overview

The Expense Reimbursement application follows a client-server architecture
with a React + Vite frontend, a Node.js + Express backend, and a Supabase
PostgreSQL database.

The frontend communicates with the backend through REST APIs. The backend
handles authentication, authorization, report operations, approval workflow,
validation, and database operations.

---

# 1. High-Level Architecture

```text
                         ┌─────────────────────┐
                         │        User         │
                         │      Web Browser    │
                         └──────────┬──────────┘
                                    │
                                    │ HTTPS
                                    ▼
                         ┌─────────────────────┐
                         │      Frontend       │
                         │    React + Vite     │
                         └──────────┬──────────┘
                                    │
                                    │ REST API
                                    ▼
                         ┌─────────────────────┐
                         │       Backend       │
                         │   Node.js + Express  │
                         └──────────┬──────────┘
                                    │
                                    │ PostgreSQL
                                    ▼
                         ┌─────────────────────┐
                         │      Database       │
                         │ Supabase PostgreSQL  │
                         └─────────────────────┘