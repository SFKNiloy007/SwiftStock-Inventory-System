# SwiftStock Inventory Management (Frontend + Backend)

This project now includes:

- React + Tailwind frontend
- Express + PostgreSQL backend
- JWT-based login
- Product search/add APIs
- CSV export from product table

## 1) PostgreSQL / pgAdmin4 setup

1. Create a PostgreSQL database in pgAdmin4 named `swiftstock`.
2. Open Query Tool and run `backend/schema.sql`.
3. Copy `backend/.env.example` to `backend/.env` and update values.

## 2) Backend setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`.

Seeded login account:

- Email: `admin@swiftstock.com`
- Password: `admin`

The backend automatically creates tables from `backend/schema.sql` and ensures the default admin account exists on startup.

## 3) Frontend setup

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` (or next open port).

If needed, set frontend API URL:

```bash
# .env in frontend root
VITE_API_BASE_URL=http://localhost:5000/api
```

## 4) Deploy on Render

This repo includes a Render blueprint file: `render.yaml`.

### Option A (recommended): Blueprint deploy

1. Push this folder to GitHub.
2. In Render, select **New +** -> **Blueprint**.
3. Choose your repo and deploy.
4. After services are created, set these two env vars in Render:

- `swiftstock-api` -> `CORS_ORIGINS=https://<your-frontend>.onrender.com`
- `swiftstock-web` -> `VITE_API_BASE_URL=https://<your-api>.onrender.com/api`

5. Redeploy both services.

### Option B: Manual deploy

- Backend (Web Service): root `backend`, build `npm install`, start `npm start`
- Frontend (Static Site): root `.`, build `npm install && npm run build`, publish `dist`

### Database on Render

- Create a PostgreSQL database on Render.
- Set backend env vars (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`) from Render DB.
- Set `DB_SSL=true` on Render.
- On deploy, backend auto-applies `backend/schema.sql` and auto-creates default admin if missing.

## 5) Postman API checklist

### Login API

- `POST /api/auth/login`
- Body:

```json
{
  "email": "admin@swiftstock.com",
  "password": "admin"
}
```

### Register API (bcrypt hash on save)

- `POST /api/auth/register`
- Body:

```json
{
  "name": "Demo Staff",
  "email": "staff@swiftstock.com",
  "password": "staff123",
  "role": "Staff"
}
```

### Product Search API (name/category filtering)

- `GET /api/products/search?name=mac&category=computers`

### Add Product API (JWT protected)

- `POST /api/products`
- Header: `Authorization: Bearer <token>`
- Body:

```json
{
  "name": "Dell XPS 13",
  "category": "Computers",
  "stockLevel": 15,
  "retailPrice": 1299.99,
  "costPrice": 999.99,
  "image": "https://example.com/image.jpg"
}
```
