import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function run() {
  const users = await pool.query(
    "SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='public' AND table_name='users' ORDER BY ordinal_position"
  );

  const products = await pool.query(
    "SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='public' AND table_name='products' ORDER BY ordinal_position"
  );

  console.log('users columns:', users.rows);
  console.log('products columns:', products.rows);

  await pool.end();
}

run().catch(async (error) => {
  console.error(error.message);
  await pool.end();
  process.exit(1);
});
