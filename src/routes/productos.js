const express = require('express');
const router = express.Router();

let productos = [
  { id: 1, nombre: 'Laptop', precio: 15000, stock: 10 },
  { id: 2, nombre: 'Mouse', precio: 350, stock: 50 },
  { id: 3, nombre: 'Teclado', precio: 800, stock: 30 },
];

router.get('/', (req, res) => {
  res.json(productos);
});

router.get('/:id', (req, res) => {
  const producto = productos.find(p => p.id === parseInt(req.params.id));
  if (!producto) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  res.json(producto);
});

router.post('/', (req, res) => {
  const { nombre, precio, stock } = req.body;
  if (!nombre || !precio) {
    return res.status(400).json({ error: 'nombre y precio son requeridos' });
  }
  const nuevo = { id: productos.length + 1, nombre, precio, stock: stock || 0 };
  productos.push(nuevo);
  res.status(201).json(nuevo);
});

router.put('/:id', (req, res) => {
  const index = productos.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  productos[index] = { ...productos[index], ...req.body };
  res.json(productos[index]);
});

router.delete('/:id', (req, res) => {
  const index = productos.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  productos.splice(index, 1);
  res.json({ message: 'Producto eliminado' });
});

module.exports = router;