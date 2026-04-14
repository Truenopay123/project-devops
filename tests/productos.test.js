const request = require('supertest');
const { app } = require('../src/app');

describe('GET /api/productos', () => {
  it('retorna lista de productos', async () => {
    const res = await request(app).get('/api/productos');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('retorna producto por ID', async () => {
    const res = await request(app).get('/api/productos/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(1);
  });

  it('retorna 404 si el producto no existe', async () => {
    const res = await request(app).get('/api/productos/999');
    expect(res.statusCode).toBe(404);
  });
});

describe('POST /api/productos', () => {
  it('crea un nuevo producto', async () => {
    const res = await request(app)
      .post('/api/productos')
      .send({ nombre: 'Monitor', precio: 5000, stock: 5 });
    expect(res.statusCode).toBe(201);
    expect(res.body.nombre).toBe('Monitor');
  });

  it('retorna 400 si faltan campos', async () => {
    const res = await request(app)
      .post('/api/productos')
      .send({ stock: 5 });
    expect(res.statusCode).toBe(400);
  });
});

describe('PUT /api/productos/:id', () => {
  it('actualiza un producto existente', async () => {
    const res = await request(app)
      .put('/api/productos/1')
      .send({ precio: 16000 });
    expect(res.statusCode).toBe(200);
    expect(res.body.precio).toBe(16000);
  });

  it('retorna 404 si el producto no existe', async () => {
    const res = await request(app)
      .put('/api/productos/999')
      .send({ precio: 100 });
    expect(res.statusCode).toBe(404);
  });
});

describe('DELETE /api/productos/:id', () => {
  it('elimina un producto existente', async () => {
    const res = await request(app).delete('/api/productos/2');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Producto eliminado');
  });

  it('retorna 404 si el producto no existe', async () => {
    const res = await request(app).delete('/api/productos/999');
    expect(res.statusCode).toBe(404);
  });
});