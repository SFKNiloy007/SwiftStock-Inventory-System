import bcrypt from 'bcryptjs';
import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { pool } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.get('/', requireAuth, async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT user_id, name, email, role
       FROM users
       ORDER BY user_id DESC`
    );

    const members = result.rows.map((row) => ({
      id: String(row.user_id),
      name: row.name,
      email: row.email,
      role: row.role === 'ADMIN' ? 'Admin' : 'Staff',
    }));

    return res.json({ members });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load team members', error: error.message });
  }
});

router.post(
  '/',
  requireAuth,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .custom((value) => emailRegex.test(value))
      .withMessage('Valid email is required'),
    body('role').isIn(['Admin', 'Staff']).withMessage('Role must be Admin or Staff'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { name, email, role } = req.body;

    try {
      const existing = await pool.query('SELECT user_id FROM users WHERE email = $1', [email]);
      if (existing.rows.length) {
        return res.status(409).json({ message: 'Email already exists' });
      }

      const passwordHash = await bcrypt.hash('staff123', 10);
      const dbRole = role === 'Admin' ? 'ADMIN' : 'STAFF';

      const inserted = await pool.query(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES ($1, $2, $3, $4)
         RETURNING user_id, name, email, role`,
        [name, email, passwordHash, dbRole]
      );

      const row = inserted.rows[0];

      return res.status(201).json({
        member: {
          id: String(row.user_id),
          name: row.name,
          email: row.email,
          role: row.role === 'ADMIN' ? 'Admin' : 'Staff',
        },
      });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to create member', error: error.message });
    }
  }
);

router.put(
  '/:id',
  requireAuth,
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid member id'),
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .custom((value) => emailRegex.test(value))
      .withMessage('Valid email is required'),
    body('role').isIn(['Admin', 'Staff']).withMessage('Role must be Admin or Staff'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const memberId = Number(req.params.id);
    const { name, email, role } = req.body;
    const dbRole = role === 'Admin' ? 'ADMIN' : 'STAFF';

    try {
      const duplicate = await pool.query(
        'SELECT user_id FROM users WHERE email = $1 AND user_id <> $2',
        [email, memberId]
      );

      if (duplicate.rows.length) {
        return res.status(409).json({ message: 'Email already exists' });
      }

      const updated = await pool.query(
        `UPDATE users
         SET name = $1, email = $2, role = $3
         WHERE user_id = $4
         RETURNING user_id, name, email, role`,
        [name, email, dbRole, memberId]
      );

      if (!updated.rows.length) {
        return res.status(404).json({ message: 'Member not found' });
      }

      const row = updated.rows[0];
      return res.json({
        member: {
          id: String(row.user_id),
          name: row.name,
          email: row.email,
          role: row.role === 'ADMIN' ? 'Admin' : 'Staff',
        },
      });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to update member', error: error.message });
    }
  }
);

router.delete('/:id', requireAuth, [param('id').isInt({ min: 1 })], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  const memberId = Number(req.params.id);

  try {
    const deleted = await pool.query('DELETE FROM users WHERE user_id = $1 RETURNING user_id', [memberId]);

    if (!deleted.rows.length) {
      return res.status(404).json({ message: 'Member not found' });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete member', error: error.message });
  }
});

export default router;
