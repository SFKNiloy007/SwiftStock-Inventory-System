import bcrypt from 'bcryptjs';
import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { pool } from '../config/db.js';

const router = express.Router();

const loginValidators = [
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('password').trim().notEmpty().withMessage('Password is required'),
];

const registerValidators = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['Admin', 'Staff']).withMessage('Role must be Admin or Staff'),
];

router.post('/login', loginValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const userResult = await pool.query(
      'SELECT user_id, name, email, role, password_hash FROM users WHERE email = $1',
      [email]
    );

    if (!userResult.rows.length) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = userResult.rows[0];
    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      {
        id: user.user_id,
        email: user.email,
        role: user.role === 'ADMIN' ? 'Admin' : 'Staff',
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({
      token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role === 'ADMIN' ? 'Admin' : 'Staff',
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

router.post('/register', registerValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  const { name, email, password, role = 'Staff' } = req.body;
  const dbRole = role === 'Admin' ? 'ADMIN' : 'STAFF';

  try {
    const existing = await pool.query('SELECT user_id FROM users WHERE email = $1', [email]);
    if (existing.rows.length) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const insertResult = await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING user_id, name, email, role`,
      [name, email, passwordHash, dbRole]
    );

    const user = insertResult.rows[0];

    return res.status(201).json({
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role === 'ADMIN' ? 'Admin' : 'Staff',
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

export default router;
