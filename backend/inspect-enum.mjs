import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function run() {
  const res = await pool.query(
    `SELECT t.typname AS enum_name, e.enumlabel AS value
     FROM pg_type t
     JOIN pg_enum e ON t.oid = e.enumtypid
     ORDER BY t.typname, e.enumsortorder`
  );

  console.log(res.rows);
  await pool.end();
}

run().catch(async (error) => {
  console.error(error.message);
  await pool.end();
  process.exit(1);
});
