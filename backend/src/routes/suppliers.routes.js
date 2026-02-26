import express from 'express';
import { body, validationResult } from 'express-validator';
import { pool } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

async function ensureSuppliersTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS suppliers (
      supplier_id SERIAL PRIMARY KEY,
      supplier_code VARCHAR(30) UNIQUE NOT NULL,
      name VARCHAR(200) NOT NULL,
      category VARCHAR(120) NOT NULL,
      contact_email VARCHAR(255) NOT NULL,
      status VARCHAR(20) NOT NULL CHECK (status IN ('Active', 'Pending')),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

router.get('/', requireAuth, async (req, res) => {
  const search = (req.query.search || '').toString().trim().toLowerCase();

  try {
    await ensureSuppliersTable();

    const result = await pool.query(
      `SELECT supplier_id, supplier_code, name, category, contact_email, status
       FROM suppliers
       WHERE ($1 = ''
              OR LOWER(name) LIKE '%' || $1 || '%'
              OR LOWER(category) LIKE '%' || $1 || '%'
              OR LOWER(contact_email) LIKE '%' || $1 || '%')
       ORDER BY supplier_id DESC`,
      [search]
    );

    const suppliers = result.rows.map((row) => ({
      id: row.supplier_code,
      name: row.name,
      category: row.category,
      contact: row.contact_email,
      status: row.status,
    }));

    return res.json({ suppliers });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load suppliers', error: error.message });
  }
});

router.post(
  '/',
  requireAuth,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('contact').trim().isEmail().withMessage('Valid contact email is required'),
    body('status').optional().isIn(['Active', 'Pending']).withMessage('Invalid status'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { name, category, contact, status = 'Pending' } = req.body;

    try {
      await ensureSuppliersTable();

      const countResult = await pool.query('SELECT COUNT(*)::int AS count FROM suppliers');
      const nextNumber = countResult.rows[0].count + 1;
      const supplierCode = `SUP-${String(nextNumber).padStart(2, '0')}`;

      const inserted = await pool.query(
        `INSERT INTO suppliers (supplier_code, name, category, contact_email, status)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING supplier_code, name, category, contact_email, status`,
        [supplierCode, name, category, contact, status]
      );

      const row = inserted.rows[0];
      return res.status(201).json({
        supplier: {
          id: row.supplier_code,
          name: row.name,
          category: row.category,
          contact: row.contact_email,
          status: row.status,
        },
      });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to create supplier', error: error.message });
    }
  }
);

export default router;
