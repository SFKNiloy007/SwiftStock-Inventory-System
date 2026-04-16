import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

const host = process.env.DB_HOST ?? '';
const connectionString = process.env.DATABASE_URL?.trim();
const hasExplicitSslSetting = typeof process.env.DB_SSL === 'string';
const defaultUseSsl = hasExplicitSslSetting ? process.env.DB_SSL === 'true' : host.includes('render.com');

let sslEnabled = defaultUseSsl;

function createPool(useSsl) {
  const baseConfig = {
    connectionTimeoutMillis: Number(process.env.DB_CONNECT_TIMEOUT_MS || 15000),
  };

  if (connectionString) {
    return new Pool({
      ...baseConfig,
      connectionString,
      ssl: useSsl ? { rejectUnauthorized: false } : false,
    });
  }

  return new Pool({
    ...baseConfig,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: useSsl ? { rejectUnauthorized: false } : false,
  });
}

export let pool = createPool(sslEnabled);

async function rebuildPool(useSsl) {
  try {
    await pool.end();
  } catch {
    // Ignore close errors while rebuilding pool.
  }

  sslEnabled = useSsl;
  pool = createPool(sslEnabled);
}

export async function testDbConnection() {
  try {
    await pool.query('SELECT 1');
  } catch (error) {
    const message = String(error?.message || '');
    const requiresSsl = message.includes('SSL/TLS required');
    const shouldAttemptFallback =
      requiresSsl ||
      message.includes('Connection terminated unexpectedly') ||
      message.includes('no pg_hba.conf entry') ||
      message.includes('server does not support SSL') ||
      message.includes('self-signed certificate');

    if (!shouldAttemptFallback) {
      throw error;
    }

    // Render databases can explicitly require TLS; force-enable SSL in that case.
    const nextSslMode = requiresSsl ? true : !sslEnabled;
    await rebuildPool(nextSslMode);
    await pool.query('SELECT 1');
  }
}
