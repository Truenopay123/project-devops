const express = require('express');
const client = require('prom-client');
const productosRouter = require('./routes/productos');

const app = express();
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequests = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de peticiones HTTP',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

app.use(express.json());

app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequests.inc({
      method: req.method,
      route: req.path,
      status: res.statusCode,
    });
  });
  next();
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    env: process.env.APP_ENV || 'local',
    version: '1.0.0',
  });
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.use('/api/productos', productosRouter);

app.get('/', (req, res) => {
  const accept = req.headers['accept'] || '';
  if (accept.includes('text/html')) {
    const env = process.env.APP_ENV || 'local';
    const color = env === 'blue' ? '#3b82f6' : '#22c55e';
    const endpoints = [
      ['GET', '/health'],
      ['GET', '/metrics'],
      ['GET', '/api/productos'],
      ['GET', '/api/productos/:id'],
      ['POST', '/api/productos'],
      ['PUT', '/api/productos/:id'],
      ['DELETE', '/api/productos/:id'],
    ];
    res.send(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>project-devops</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', sans-serif; background: #0f172a; color: #e2e8f0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
    .card { background: #1e293b; border-radius: 16px; padding: 40px; max-width: 520px; width: 90%; box-shadow: 0 25px 50px rgba(0,0,0,0.5); }
    .badge { display: inline-block; background: ${color}; color: white; padding: 4px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-bottom: 16px; text-transform: uppercase; }
    h1 { font-size: 26px; font-weight: 700; margin-bottom: 4px; }
    .version { color: #94a3b8; font-size: 14px; margin-bottom: 28px; }
    .label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 10px; }
    .endpoint { background: #0f172a; border-radius: 8px; padding: 10px 16px; margin: 6px 0; font-size: 14px; font-family: monospace; display: flex; gap: 12px; align-items: center; }
    .method { font-weight: 700; min-width: 55px; }
    .GET { color: #22c55e; }
    .POST { color: #f59e0b; }
    .PUT { color: #3b82f6; }
    .DELETE { color: #ef4444; }
    .path { color: #7dd3fc; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">${env}</div>
    <h1>project-devops</h1>
    <div class="version">v1.0.0 &mdash; API REST de Productos</div>
    <div class="label">Endpoints disponibles</div>
    ${endpoints.map(([m, p]) => `
    <div class="endpoint">
      <span class="method ${m}">${m}</span>
      <span class="path">${p}</span>
    </div>`).join('')}
  </div>
</body>
</html>`);
  } else {
    res.json({
      proyecto: 'project-devops',
      version: '1.0.0',
      env: process.env.APP_ENV || 'local',
      endpoints: [
        'GET /health',
        'GET /metrics',
        'GET /api/productos',
        'GET /api/productos/:id',
        'POST /api/productos',
        'PUT /api/productos/:id',
        'DELETE /api/productos/:id',
      ],
    });
  }
});

module.exports = { app, register };