import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { pool } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const productValidators = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('stockLevel').isInt({ min: 0 }).withMessage('Stock level must be 0 or greater'),
  body('retailPrice').isFloat({ gt: 0 }).withMessage('Retail price must be greater than 0'),
  body('costPrice').isFloat({ gt: 0 }).withMessage('Cost price must be greater than 0'),
  body('image').optional().isURL().withMessage('Image must be a valid URL'),
  body('minStockLevel').optional().isInt({ min: 0 }).withMessage('Min stock level must be 0 or greater'),
];

router.get(
  '/search',
  [
    query('name').optional().isString(),
    query('category').optional().isString(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { name = '', category = '' } = req.query;

    try {
      const result = await pool.query(
        `SELECT product_id, product_name, category, stock_quantity, retail_price, cost_price
         FROM products
         WHERE ($1 = '' OR LOWER(product_name) LIKE LOWER('%' || $1 || '%'))
           AND ($2 = '' OR LOWER(category) LIKE LOWER('%' || $2 || '%'))
         ORDER BY product_id DESC`,
        [name, category]
      );

      const products = result.rows.map((row) => ({
        id: row.product_id,
        name: row.product_name,
        category: row.category,
        stockLevel: Number(row.stock_quantity),
        retailPrice: Number(row.retail_price),
        costPrice: Number(row.cost_price),
        image: '',
      }));

      return res.json({ products });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to search products', error: error.message });
    }
  }
);

router.post('/', requireAuth, productValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  const {
    name,
    category,
    stockLevel,
    retailPrice,
    costPrice,
    minStockLevel = 10,
  } = req.body;

  try {
    const insertResult = await pool.query(
      `INSERT INTO products (product_name, category, stock_quantity, retail_price, cost_price, min_stock_level)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING product_id, product_name, category, stock_quantity, retail_price, cost_price`,
      [name, category, stockLevel, retailPrice, costPrice, minStockLevel]
    );

    const row = insertResult.rows[0];

    return res.status(201).json({
      product: {
        id: row.product_id,
        name: row.product_name,
        category: row.category,
        stockLevel: Number(row.stock_quantity),
        retailPrice: Number(row.retail_price),
        costPrice: Number(row.cost_price),
        image: '',
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to add product', error: error.message });
  }
});

router.delete('/flush', requireAuth, async (req, res) => {
  const { password } = req.body ?? {};

  if (req.user?.role !== 'Admin') {
    return res.status(403).json({ message: 'Only admin can flush products' });
  }

  if (password !== '1234') {
    return res.status(401).json({ message: 'Invalid flush password' });
  }

  try {
    await pool.query('DELETE FROM products');
    return res.json({ message: 'All products deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to flush products', error: error.message });
  }
});

export default router;
