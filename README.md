# QuickBill — Point of Sale System

This repository contains a full-stack POS system scaffold.

Structure:
- `backend/` — Express.js + Sequelize API
- `frontend/` — React + Vite + Tailwind UI
- `db/schema.sql` — initial MySQL schema

Getting started (development):

1. Backend

```powershell
cd "f:\QuickBill-Point of Sale System\backend"
npm install
copy .env.example .env
# edit .env to point to your MySQL
npm run dev
```

2. Frontend

```bash
cd "f:\QuickBill-Point of Sale System\frontend"
npm install
cp .env.example .env
npm run dev
```

Notes:
- This is an initial scaffold implementing authentication, core models, and product APIs.
- Use `db/seed_data.sql` to load realistic sample data via phpMyAdmin or MySQL CLI.
- Next steps: implement orders endpoints, POS realtime flows, invoice generation, AI insights, and deployment scripts.
