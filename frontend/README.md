# Velora's Flash Forge Frontend Workspace

This directory contains the isolated **Next.js 14 Frontend Application** for Velora's Flash Forge Platform.

## 🚀 Quick Start for Frontend Team

### 1. Configure Environment Variables
Copy `.env.example` to `.env.local` inside this directory:
```bash
cp .env.example .env.local
```
*(Note: `.env.local` is ignored by git to protect credentials).*

### 2. Install Dependencies
```bash
cd frontend
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open **http://localhost:3000** in your browser.

---

## 📁 Directory Structure
```
frontend/
├── src/
│   ├── app/                   # Next.js App Router (pages, layout, API routes)
│   ├── core/                  # Domain Types, State Machine, Strategy Pattern
│   ├── lib/                   # Supabase integration
│   └── simulation/            # 10,000 Request Concurrency Simulator
├── .env.example               # Environment variables template (committed to git)
├── .env.local                 # Local secrets file (IGNORED by git)
├── package.json
└── tsconfig.json
```
