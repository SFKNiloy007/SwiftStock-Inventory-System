import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { pool } from '../config/db.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { getImageValue, uploadImage } from '../middleware/imageUpload.js';

const router = express.Router();

const productValidators = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('stockLevel').isInt({ min: 0 }).withMessage('Stock level must be 0 or greater'),
  body('retailPrice').isFloat({ gt: 0 }).withMessage('Retail price must be greater than 0'),
  body('costPrice').isFloat({ gt: 0 }).withMessage('Cost price must be greater than 0'),
  body('image')
    .optional({ values: 'falsy' })
    .custom((value) => /^https?:\/\//i.test(value) || /^data:image\//i.test(value))
    .withMessage('Image must be a valid image URL'),
  body('minStockLevel').optional().isInt({ min: 0 }).withMessage('Min stock level must be 0 or greater'),
];

router.get(
  '/search',
  [
    query('name').optional().isString(),
    query('category').optional().isString(),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be 1 or greater'),
    query('pageSize').optional().isInt({ min: 1, max: 100 }).withMessage('Page size must be between 1 and 100'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { name = '', category = '' } = req.query;
    const page = Math.max(1, Number(req.query.page ?? 1));
    const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize ?? 20)));
    const offset = (page - 1) * pageSize;

    try {
      const countResult = await pool.query(
        `SELECT COUNT(*)::int AS total
         FROM products
         WHERE ($1 = '' OR LOWER(product_name) LIKE LOWER('%' || $1 || '%'))
           AND ($2 = '' OR LOWER(category) LIKE LOWER('%' || $2 || '%'))`,
        [name, category]
      );

      const total = countResult.rows[0]?.total ?? 0;

      const result = await pool.query(
        `SELECT product_id, product_name, category, stock_quantity, retail_price, cost_price, image, min_stock_level
         FROM products
         WHERE ($1 = '' OR LOWER(product_name) LIKE LOWER('%' || $1 || '%'))
           AND ($2 = '' OR LOWER(category) LIKE LOWER('%' || $2 || '%'))
         ORDER BY product_id DESC
         LIMIT $3 OFFSET $4`,
        [name, category, pageSize, offset]
      );

      const products = result.rows.map((row) => ({
        id: row.product_id,
        name: row.product_name,
        category: row.category,
        stockLevel: Number(row.stock_quantity),
        retailPrice: Number(row.retail_price),
        costPrice: Number(row.cost_price),
        image: row.image ?? '',
        minStockLevel: Number(row.min_stock_level ?? 10),
      }));

      return res.json({
        products,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.max(1, Math.ceil(total / pageSize)),
        },
      });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to search products', error: error.message });
    }
  }
);

router.post('/', requireAuth, requireAdmin, uploadImage.single('imageFile'), productValidators, async (req, res) => {
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
    image,
    minStockLevel = 10,
  } = req.body;
  const imageValue = getImageValue(req.file, image);

  try {
    const insertResult = await pool.query(
      `INSERT INTO products (product_name, category, stock_quantity, retail_price, cost_price, image, min_stock_level)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING product_id, product_name, category, stock_quantity, retail_price, cost_price, image, min_stock_level`,
      [name, category, stockLevel, retailPrice, costPrice, imageValue, minStockLevel]
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
        image: row.image ?? '',
        minStockLevel: Number(row.min_stock_level ?? 10),
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to add product', error: error.message });
  }
});

router.patch(
  '/:id/sell',
  requireAuth,
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid product id'),
    body('quantity')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Quantity must be at least 1'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const productId = Number(req.params.id);
    const quantity = Number(req.body?.quantity ?? 1);

    try {
      const stockResult = await pool.query(
        `SELECT product_id, product_name, category, stock_quantity, retail_price, cost_price, image, min_stock_level
         FROM products
         WHERE product_id = $1`,
        [productId]
      );

      if (!stockResult.rows.length) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const current = stockResult.rows[0];
      const currentStock = Number(current.stock_quantity);

      if (currentStock < quantity) {
        return res.status(400).json({
          message: `Insufficient stock. Available quantity: ${currentStock}`,
        });
      }

      const updatedResult = await pool.query(
        `UPDATE products
         SET stock_quantity = stock_quantity - $1
         WHERE product_id = $2
         RETURNING product_id, product_name, category, stock_quantity, retail_price, cost_price, image, min_stock_level`,
        [quantity, productId]
      );

      const updated = updatedResult.rows[0];
      const stockLevel = Number(updated.stock_quantity);
      const minStockLevel = Number(updated.min_stock_level ?? 10);

      return res.json({
        product: {
          id: updated.product_id,
          name: updated.product_name,
          category: updated.category,
          stockLevel,
          retailPrice: Number(updated.retail_price),
          costPrice: Number(updated.cost_price),
          image: updated.image ?? '',
          minStockLevel,
        },
        lowStock: stockLevel <= minStockLevel,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to complete sale', error: error.message });
    }
  }
);

router.delete('/flush', requireAuth, requireAdmin, async (req, res) => {
  const { password } = req.body ?? {};
  const expectedFlushPassword = process.env.FLUSH_PASSWORD;

  if (!expectedFlushPassword) {
    return res.status(500).json({ message: 'Flush password is not configured on server' });
  }

  if (password !== expectedFlushPassword) {
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
