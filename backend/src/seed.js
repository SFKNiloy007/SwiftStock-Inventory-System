import bcrypt from 'bcryptjs';
import { pool } from './config/db.js';

async function seed() {
  try {
    const adminExists = await pool.query('SELECT user_id FROM users WHERE email = $1', ['admin@swiftstock.com']);

    if (!adminExists.rows.length) {
      const passwordHash = await bcrypt.hash('admin', 10);
      await pool.query(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES ($1, $2, $3, $4)`,
        ['System Admin', 'admin@swiftstock.com', passwordHash, 'ADMIN']
      );
      console.log('Admin user created: admin@swiftstock.com / admin');
    } else {
      console.log('Admin user already exists');
    }

    const productsCount = await pool.query('SELECT COUNT(*)::int AS count FROM products');

    if (productsCount.rows[0].count === 0) {
      await pool.query(
        `INSERT INTO products (product_name, category, stock_quantity, retail_price, cost_price, min_stock_level)
         VALUES
         ('MacBook Pro 16"', 'Computers', 24, 2499.99, 1899.99, 10),
         ('Sony WH-1000XM5', 'Audio', 56, 399.99, 279.99, 12),
         ('iPhone 15 Pro', 'Mobile', 12, 999.99, 749.99, 8),
         ('Herman Miller Aeron', 'Furniture', 8, 1495.00, 1095.00, 5);`
      );
      console.log('Seeded sample products');
    } else {
      console.log('Products already seeded');
    }

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

    const suppliersCount = await pool.query('SELECT COUNT(*)::int AS count FROM suppliers');

    if (suppliersCount.rows[0].count === 0) {
      await pool.query(`
        INSERT INTO suppliers (supplier_code, name, category, contact_email, status)
        VALUES
        ('SUP-01', 'TechSupply Global', 'Computers', 'contact@techsupply.com', 'Active'),
        ('SUP-02', 'AudioCore Ltd.', 'Audio', 'sales@audiocore.com', 'Active'),
        ('SUP-03', 'OfficeNova', 'Furniture', 'orders@officenova.com', 'Pending'),
        ('SUP-04', 'MobileWorks', 'Mobile', 'team@mobileworks.io', 'Active')
      `);
      console.log('Seeded suppliers');
    } else {
      console.log('Suppliers already seeded');
    }

    console.log('Seeding complete');
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
