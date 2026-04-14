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

module.exports = { app, register };