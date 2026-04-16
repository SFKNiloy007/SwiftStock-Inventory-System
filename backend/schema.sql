CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  avatar_image TEXT,
  is_owner BOOLEAN NOT NULL DEFAULT FALSE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'STAFF')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE users
ADD COLUMN IF NOT EXISTS avatar_image TEXT;

ALTER TABLE users
ADD COLUMN IF NOT EXISTS is_owner BOOLEAN NOT NULL DEFAULT FALSE;

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

CREATE TABLE IF NOT EXISTS sales (
  sale_id SERIAL PRIMARY KEY,
  sold_by_user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
  total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE sales
ADD COLUMN IF NOT EXISTS sold_by_user_id INTEGER;

ALTER TABLE sales
ADD COLUMN IF NOT EXISTS total_amount NUMERIC(12,2) NOT NULL DEFAULT 0;

ALTER TABLE sales
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'fk_sales_sold_by_user_id'
  ) THEN
    ALTER TABLE sales
    ADD CONSTRAINT fk_sales_sold_by_user_id
    FOREIGN KEY (sold_by_user_id) REFERENCES users(user_id) ON DELETE RESTRICT;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS sale_items (
  sale_item_id SERIAL PRIMARY KEY,
  sale_id INTEGER NOT NULL REFERENCES sales(sale_id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(product_id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(12,2) NOT NULL,
  unit_cost NUMERIC(12,2) NOT NULL,
  line_total NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE sale_items
ADD COLUMN IF NOT EXISTS sale_id INTEGER;

ALTER TABLE sale_items
ADD COLUMN IF NOT EXISTS product_id INTEGER;

ALTER TABLE sale_items
ADD COLUMN IF NOT EXISTS quantity INTEGER;

ALTER TABLE sale_items
ADD COLUMN IF NOT EXISTS unit_price NUMERIC(12,2);

ALTER TABLE sale_items
ADD COLUMN IF NOT EXISTS unit_cost NUMERIC(12,2);

ALTER TABLE sale_items
ADD COLUMN IF NOT EXISTS line_total NUMERIC(12,2);

ALTER TABLE sale_items
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'fk_sale_items_sale_id'
  ) THEN
    ALTER TABLE sale_items
    ADD CONSTRAINT fk_sale_items_sale_id
    FOREIGN KEY (sale_id) REFERENCES sales(sale_id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'fk_sale_items_product_id'
  ) THEN
    ALTER TABLE sale_items
    ADD CONSTRAINT fk_sale_items_product_id
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_products_name_lower
ON products (LOWER(product_name));

CREATE INDEX IF NOT EXISTS idx_products_category_lower
ON products (LOWER(category));

CREATE INDEX IF NOT EXISTS idx_sales_user_id
ON sales (sold_by_user_id);

CREATE INDEX IF NOT EXISTS idx_sale_items_sale_id
ON sale_items (sale_id);

CREATE INDEX IF NOT EXISTS idx_sale_items_product_id
ON sale_items (product_id);
