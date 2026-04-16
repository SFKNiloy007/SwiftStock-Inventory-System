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
    const serverDoesNotSupportSsl = message.includes('server does not support SSL');
    const pgHbaSuggestsSsl =
      message.includes('no pg_hba.conf entry') &&
      (message.includes('SSL off') || message.includes('SSL/TLS'));

    // Only flip SSL mode when the server explicitly tells us what it needs.
    if ((requiresSsl || pgHbaSuggestsSsl) && !sslEnabled) {
      await rebuildPool(true);
      await pool.query('SELECT 1');
      return;
    }

    if (serverDoesNotSupportSsl && sslEnabled) {
      await rebuildPool(false);
      await pool.query('SELECT 1');
      return;
    }

    // For transient termination errors, keep the same SSL mode and let outer retry loop handle attempts.
    throw error;
  }
}
