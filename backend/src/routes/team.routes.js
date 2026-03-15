import bcrypt from 'bcryptjs';
import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { pool } from '../config/db.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { getImageValue, uploadImage } from '../middleware/imageUpload.js';

const router = express.Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function toApiRole(row) {
  if (row.is_owner) {
    return 'Owner';
  }

  return row.role === 'ADMIN' ? 'Admin' : 'Staff';
}

function toDbRole(apiRole) {
  if (apiRole === 'Staff') {
    return 'STAFF';
  }

  return 'ADMIN';
}

router.get('/', requireAuth, requireAdmin, async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT user_id, name, email, role, is_owner, avatar_image
       FROM users
       ORDER BY user_id DESC`
    );

    const members = result.rows.map((row) => ({
      id: String(row.user_id),
      name: row.name,
      email: row.email,
      avatarImage: row.avatar_image ?? '',
      role: toApiRole(row),
    }));

    return res.json({ members });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load team members', error: error.message });
  }
});

router.post(
  '/',
  requireAuth,
  requireAdmin,
  uploadImage.single('avatarFile'),
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .custom((value) => emailRegex.test(value))
      .withMessage('Valid email is required'),
    body('password')
      .trim()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('role').isIn(['Owner', 'Admin', 'Staff']).withMessage('Role must be Owner, Admin, or Staff'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { name, email, password, role, avatarImage } = req.body;

    try {
      const existing = await pool.query('SELECT user_id FROM users WHERE email = $1', [email]);
      if (existing.rows.length) {
        return res.status(409).json({ message: 'Email already exists' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const dbRole = toDbRole(role);
      const isOwner = role === 'Owner';
      const imageValue = getImageValue(req.file, avatarImage);

      if (isOwner) {
        const ownerCheck = await pool.query('SELECT user_id FROM users WHERE is_owner = TRUE LIMIT 1');
        if (ownerCheck.rows.length) {
          return res.status(409).json({ message: 'An owner account already exists' });
        }
      }

      const inserted = await pool.query(
        `INSERT INTO users (name, email, password_hash, avatar_image, role, is_owner)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING user_id, name, email, avatar_image, role, is_owner`,
        [name, email, passwordHash, imageValue, dbRole, isOwner]
      );

      const row = inserted.rows[0];

      return res.status(201).json({
        member: {
          id: String(row.user_id),
          name: row.name,
          email: row.email,
          avatarImage: row.avatar_image ?? '',
          role: toApiRole(row),
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
  requireAdmin,
  uploadImage.single('avatarFile'),
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid member id'),
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .custom((value) => emailRegex.test(value))
      .withMessage('Valid email is required'),
    body('password')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('role').isIn(['Owner', 'Admin', 'Staff']).withMessage('Role must be Owner, Admin, or Staff'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const memberId = Number(req.params.id);
    const { name, email, password, role, avatarImage } = req.body;
    const dbRole = toDbRole(role);
    const isOwner = role === 'Owner';
    const imageValue = getImageValue(req.file, avatarImage);

    try {
      const duplicate = await pool.query(
        'SELECT user_id FROM users WHERE email = $1 AND user_id <> $2',
        [email, memberId]
      );

      if (duplicate.rows.length) {
        return res.status(409).json({ message: 'Email already exists' });
      }

      const existingMemberResult = await pool.query(
        'SELECT user_id, is_owner FROM users WHERE user_id = $1',
        [memberId]
      );

      if (!existingMemberResult.rows.length) {
        return res.status(404).json({ message: 'Member not found' });
      }

      const existingMember = existingMemberResult.rows[0];

      if (existingMember.is_owner && role !== 'Owner') {
        return res.status(400).json({ message: 'Owner role cannot be changed' });
      }

      if (!existingMember.is_owner && isOwner) {
        const ownerCheck = await pool.query(
          'SELECT user_id FROM users WHERE is_owner = TRUE AND user_id <> $1 LIMIT 1',
          [memberId]
        );

        if (ownerCheck.rows.length) {
          return res.status(409).json({ message: 'An owner account already exists' });
        }
      }

      const nextPasswordHash = password ? await bcrypt.hash(password, 10) : null;

      const updated = await pool.query(
        `UPDATE users
         SET name = $1,
             email = $2,
             avatar_image = $3,
             role = $4,
             is_owner = $5,
             password_hash = COALESCE($6, password_hash)
         WHERE user_id = $7
         RETURNING user_id, name, email, avatar_image, role, is_owner`,
        [
          name,
          email,
          imageValue,
          dbRole,
          existingMember.is_owner ? true : isOwner,
          nextPasswordHash,
          memberId,
        ]
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
          avatarImage: row.avatar_image ?? '',
          role: toApiRole(row),
        },
      });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to update member', error: error.message });
    }
  }
);

router.delete('/:id', requireAuth, requireAdmin, [param('id').isInt({ min: 1 })], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  const memberId = Number(req.params.id);

  try {
    const memberResult = await pool.query('SELECT user_id, is_owner FROM users WHERE user_id = $1', [memberId]);

    if (!memberResult.rows.length) {
      return res.status(404).json({ message: 'Member not found' });
    }

    if (memberResult.rows[0].is_owner) {
      return res.status(403).json({ message: 'Owner profile cannot be deleted' });
    }

    const deleted = await pool.query('DELETE FROM users WHERE user_id = $1 RETURNING user_id', [memberId]);

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete member', error: error.message });
  }
});

export default router;
