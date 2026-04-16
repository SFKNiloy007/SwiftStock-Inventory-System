import dotenv from 'dotenv';
import app from './app.js';
import { ensureDefaultAdmin } from './config/bootstrapData.js';
import { pool, testDbConnection } from './config/db.js';
import { applySchemaFromFile } from './config/initDb.js';

dotenv.config();

const PORT = Number(process.env.PORT || 5000);
const HOST = process.env.HOST || '0.0.0.0';

function validateSecurityConfiguration() {
  const jwtSecret = process.env.JWT_SECRET;
  const emergencyPin = process.env.EMERGENCY_LOGIN_PIN;
  const flushPassword = process.env.FLUSH_PASSWORD;

  if (!jwtSecret || jwtSecret.includes('replace_with_')) {
    throw new Error('JWT_SECRET is not configured securely');
  }

  if (!emergencyPin || emergencyPin.length < 6) {
    process.env.EMERGENCY_LOGIN_PIN = '123456';
    console.warn('EMERGENCY_LOGIN_PIN missing/invalid; using temporary fallback value for startup');
  }

  if (!flushPassword || flushPassword.length < 6) {
    process.env.FLUSH_PASSWORD = 'TempFlush123';
    console.warn('FLUSH_PASSWORD missing/invalid; using temporary fallback value for startup');
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForDb(maxAttempts = 6) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await testDbConnection();
      return;
    } catch (error) {
      lastError = error;
      const message = error?.message || 'Unknown database error';
      console.error(`Database connection attempt ${attempt}/${maxAttempts} failed: ${message}`);

      if (attempt < maxAttempts) {
        await wait(2000);
      }
    }
  }

  throw lastError;
}

async function startServer() {
  try {
    validateSecurityConfiguration();
    await waitForDb();
    await applySchemaFromFile();
    await ensureDefaultAdmin();
    app.listen(PORT, HOST, () => {
      console.log(`SwiftStock API running on http://localhost:${PORT}`);
      console.log(`IPv4 loopback: http://127.0.0.1:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error?.message || error);
    if (error?.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

startServer();

process.on('SIGINT', async () => {
  await pool.end();
  process.exit(0);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});
