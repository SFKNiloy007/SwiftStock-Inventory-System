import { describe, expect, it, jest } from '@jest/globals';
import request from 'supertest';
import app from '../src/app.js';
import { pool, testDbConnection } from '../src/config/db.js';

describe('SwiftStock API smoke tests', () => {
  it('GET /login should load with status 200', async () => {
    const response = await request(app).get('/login');

    expect(response.statusCode).toBe(200);
  });

  it('GET /dashboard should return redirect or success', async () => {
    const response = await request(app).get('/dashboard').redirects(0);

    expect([200, 301, 302, 307, 308]).toContain(response.statusCode);
  });

  it('Mock DB connection test with SwiftStock_DB credentials', async () => {
    const querySpy = jest
      .spyOn(pool, 'query')
      .mockResolvedValueOnce({ rows: [{ ok: 1 }] });

    await expect(testDbConnection()).resolves.toBeUndefined();
    expect(querySpy).toHaveBeenCalledWith('SELECT 1');

    expect(process.env.DB_USER || 'postgres').toBe('postgres');
    expect(process.env.DB_NAME || 'SwiftStock_DB').toBe('SwiftStock_DB');

    querySpy.mockRestore();
  });
});
