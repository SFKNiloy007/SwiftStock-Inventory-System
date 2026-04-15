import bcrypt from 'bcryptjs';
import { pool } from './db.js';

export async function ensureDefaultAdmin() {
  const adminEmail = (process.env.DEFAULT_ADMIN_EMAIL || 'admin@swiftstock.com').trim();
  const adminName = (process.env.DEFAULT_ADMIN_NAME || 'System Admin').trim();
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
  const resetDefaultAdminPasswordOnBoot =
    String(process.env.RESET_DEFAULT_ADMIN_PASSWORD_ON_BOOT || '').toLowerCase() === 'true';

  await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS is_owner BOOLEAN NOT NULL DEFAULT FALSE');

  const existingOwner = await pool.query('SELECT user_id FROM users WHERE is_owner = TRUE LIMIT 1');

  if (!existingOwner.rows.length) {
    await pool.query('UPDATE users SET role = $1, is_owner = TRUE WHERE email = $2', ['ADMIN', adminEmail]);
  }

  const existing = await pool.query('SELECT user_id FROM users WHERE email = $1', [adminEmail]);
  if (existing.rows.length) {
    await pool.query('UPDATE users SET role = $1, is_owner = TRUE WHERE email = $2', ['ADMIN', adminEmail]);

    if (resetDefaultAdminPasswordOnBoot) {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      await pool.query('UPDATE users SET password_hash = $1 WHERE email = $2', [passwordHash, adminEmail]);
    }

    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await pool.query(
    `INSERT INTO users (name, email, password_hash, role, is_owner)
     VALUES ($1, $2, $3, $4, $5)`,
    [adminName, adminEmail, passwordHash, 'ADMIN', true]
  );
}
