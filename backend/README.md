# QuickBill Backend

Express + Sequelize backend for QuickBill POS.

Setup:

1. Copy `.env.example` to `.env` and fill DB + JWT values.
2. Run `npm install` inside `backend`.
3. Run `npm run dev` to start (requires MySQL reachable).

APIs:
- `POST /api/auth/login` - login
- `GET /api/auth/profile` - get profile (protected)
- `GET /api/products` - list products (protected)
