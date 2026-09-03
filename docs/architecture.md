# Architecture

## Overview

The Expense Reimbursement application follows a client-server architecture.

```text
┌─────────────────────┐
│      Frontend       │
│   React + Vite      │
└──────────┬──────────┘
           │ HTTP / REST API
           ▼
┌─────────────────────┐
│       Backend       │
│ Node.js + Express   │
└──────────┬──────────┘
           │ PostgreSQL
           ▼
┌─────────────────────┐
│      Database       │
│ Supabase PostgreSQL │
└─────────────────────┘