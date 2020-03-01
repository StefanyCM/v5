const express = require('express');
const router = express.Router();
const util = require('util');
const db = require('../utils/database');

// Promesas nativas
const query = util.promisify(db.query).bind(db);

/* Obtener listado de proveedor. */
router.get('/', async (req, res, next) => {
  const result = await query('SELECT * FROM proveedor');
  res.json(result);
});

/* Obtener un proveedor. */
router.get('/:id', async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM proveedor WHERE id_proveedor = ?', [req.params.id]);
    res.json(result);
  }
  catch (error) {
    console.log('Error =>', error);
    res.send(error.sqlMessage);
  }
});

/* Registrar proveedor. */
router.post('/', async (req, res, next) => {
  var { nit, nombre, activo, razon_social, telefono, direccion } = req.body;
  try {
    const result = await query("INSERT INTO proveedor (nit, nombre, razon_social, telefono, direccion) VALUES (?, ?, ?, ?, ?, ?)", [nit, nombre, razon_social, telefono, direccion]);           
    res.json(result);
  } catch (error) {
    console.log('Error =>', error);
    res.send(error.sqlMessage);
  }
});

/* Actualizar proveedor. */
router.put('/:id', async (req, res, next) => {
  var { nit, nombre, razon_social, telefono, direccion } = req.body;
  try {
    const result = await query(`UPDATE proveedor SET id_proveedor = ${req.params.id}, nit = ${nit}, nombre = '${nombre}', razon_social = '${razon_social}', telefono = ${telefono},  direccion = '${direccion}' WHERE id_usuario = ${req.params.id}`);           
    res.json(result);
  } catch (error) {
    console.log('Error =>', error);
    res.send(error.sqlMessage);
  }
});

/* Eliminar proveedor. */
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await query(`UPDATE proveedor SET activo = 0 WHERE id_proveedor = ${req.params.id}`);      
    res.json(result);     
  } catch (error) {
    console.log('Error =>', error);
    res.send(error.sqlMessage);
  }
});

module.exports = router;