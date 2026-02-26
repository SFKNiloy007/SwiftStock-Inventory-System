import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/products.routes.js';
import suppliersRoutes from './routes/suppliers.routes.js';
import teamRoutes from './routes/team.routes.js';

dotenv.config();

const app = express();
const defaultOrigins = ['http://localhost:5173', 'http://localhost:5174'];
const configuredOrigins = (process.env.CORS_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = new Set([...defaultOrigins, ...configuredOrigins]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      const error = new Error(`CORS blocked for origin: ${origin}`);
      error.status = 403;
      return callback(error);
    },
    credentials: true,
  })
);
app.use(express.json());

app.get('/login', (_req, res) => {
  res.status(200).json({ message: 'Login page route is available' });
});

app.get('/dashboard', (_req, res) => {
  res.redirect(302, '/staff-dashboard');
});

app.get('/staff-dashboard', (_req, res) => {
  res.status(200).json({ message: 'Staff dashboard route is available' });
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/suppliers', suppliersRoutes);

app.use((error, _req, res, _next) => {
  const status = Number(error?.status) || 500;
  return res.status(status).json({ message: 'Unexpected server error', error: error.message });
});

export default app;
