import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

const host = process.env.DB_HOST ?? '';
const useSsl = process.env.DB_SSL === 'true' || host.includes('render.com');

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
});

export async function testDbConnection() {
  await pool.query('SELECT 1');
}
