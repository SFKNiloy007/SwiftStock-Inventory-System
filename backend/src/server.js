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
    throw new Error('EMERGENCY_LOGIN_PIN must be configured with at least 6 characters');
  }

  if (!flushPassword || flushPassword.length < 6) {
    throw new Error('FLUSH_PASSWORD must be configured with at least 6 characters');
  }
}

async function startServer() {
  try {
    validateSecurityConfiguration();
    await testDbConnection();
    await applySchemaFromFile();
    await ensureDefaultAdmin();
    app.listen(PORT, HOST, () => {
      console.log(`SwiftStock API running on http://localhost:${PORT}`);
      console.log(`IPv4 loopback: http://127.0.0.1:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();

process.on('SIGINT', async () => {
  await pool.end();
  process.exit(0);
});
