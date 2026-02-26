import bcrypt from 'bcryptjs';
import { pool } from './db.js';

export async function ensureDefaultAdmin() {
  const adminEmail = (process.env.DEFAULT_ADMIN_EMAIL || 'admin@swiftstock.com').trim();
  const adminName = (process.env.DEFAULT_ADMIN_NAME || 'System Admin').trim();
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin';

  const existing = await pool.query('SELECT user_id FROM users WHERE email = $1', [adminEmail]);
  if (existing.rows.length) {
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await pool.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)`,
    [adminName, adminEmail, passwordHash, 'ADMIN']
  );
}
