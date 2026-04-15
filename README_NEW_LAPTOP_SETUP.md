# SwiftStock Setup on Another Laptop (Windows)

This guide helps you run SwiftStock on a different laptop for demo or presentation.

## 1. What you need first

Install these tools on the new laptop:

1. Node.js 20 LTS (or newer)
2. Git
3. PostgreSQL 15+ (with pgAdmin4)

Quick checks in PowerShell:

```powershell
node -v
npm -v
git --version
```

## 2. Get the project code

```powershell
git clone https://github.com/SFKNiloy007/SwiftStock-Inventory-System.git
cd SwiftStock
```

## 3. Install dependencies

Install frontend dependencies:

```powershell
npm install
```

Install backend dependencies:

```powershell
cd backend
npm install
cd ..
```

## 4. Configure database (PostgreSQL + pgAdmin4)

1. Open pgAdmin4.
2. Create a database named swiftstock.
3. Open Query Tool for swiftstock.
4. Run the SQL from backend/schema.sql.

## 5. Configure backend environment

In the backend folder:

1. Copy .env.example to .env.
2. Update values for your local PostgreSQL.

Recommended backend .env values:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=swiftstock
DB_SSL=false
JWT_SECRET=replace_with_a_long_random_secret
EMERGENCY_LOGIN_PIN=1234
CORS_ORIGINS=http://localhost:5173
```

Important:

- Use your real PostgreSQL password for DB_PASSWORD.
- Keep JWT_SECRET long and unique.

## 6. Start backend

From the backend folder:

```powershell
cd backend
npm run dev
```

Expected backend URL:

- http://localhost:5000

The backend auto-creates required tables if missing and ensures default privileged account behavior.

## 7. Configure frontend environment (optional but recommended)

In the project root, create a .env file if it does not exist:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 8. Start frontend

Open a second terminal in project root:

```powershell
npm run dev
```

Expected frontend URL:

- http://localhost:5173

## 9. Login for demo

Use seeded account:

- Email: admin@swiftstock.com
- Password: admin

## 10. Verify everything before the video

Run these checks:

1. Login works.
2. Dashboard loads.
3. Product search works.
4. Sell button decreases stock.
5. Low-stock alert appears when threshold is reached.
6. Staff cannot add products.
7. Owner/Admin can manage team and suppliers.

## 11. Optional: run backend tests

```powershell
cd backend
npm test
```

## 12. Common issues and fixes

### Port already in use

- If 5000 is busy, change PORT in backend .env.
- If 5173 is busy, Vite will auto-pick next port (check terminal output).

### Database connection failed

- Recheck DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME.
- Confirm PostgreSQL service is running.

### CORS error in browser

- Ensure backend .env has CORS_ORIGINS matching frontend URL.
- Restart backend after env changes.

### Invalid token / unauthorized

- Clear browser local storage and login again.

## 13. Fast start (copy/paste)

Terminal 1:

```powershell
cd SwiftStock\backend
npm run dev
```

Terminal 2:

```powershell
cd SwiftStock
npm run dev
```
