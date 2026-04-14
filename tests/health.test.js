const request = require('supertest');
const { app } = require('../src/app');

describe('GET /health', () => {
  it('responde 200 con status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('responde con version 1.0.0', async () => {
    const res = await request(app).get('/health');
    expect(res.body.version).toBe('1.0.0');
  });
});