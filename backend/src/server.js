import dotenv from 'dotenv';
import app from './app.js';
import { pool, testDbConnection } from './config/db.js';

dotenv.config();

const PORT = Number(process.env.PORT || 5000);
const HOST = process.env.HOST || '0.0.0.0';

async function startServer() {
  try {
    await testDbConnection();
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
