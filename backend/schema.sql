CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'STAFF')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  product_id SERIAL PRIMARY KEY,
  product_name VARCHAR(200) NOT NULL,
  category VARCHAR(120) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  retail_price NUMERIC(12,2) NOT NULL,
  cost_price NUMERIC(12,2) NOT NULL,
  image TEXT,
  min_stock_level INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE products
ADD COLUMN IF NOT EXISTS image TEXT;

CREATE TABLE IF NOT EXISTS suppliers (
  supplier_id SERIAL PRIMARY KEY,
  supplier_code VARCHAR(30) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(120) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('Active', 'Pending')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_name_lower
ON products (LOWER(product_name));

CREATE INDEX IF NOT EXISTS idx_products_category_lower
ON products (LOWER(category));
