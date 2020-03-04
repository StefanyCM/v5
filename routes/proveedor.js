const express = require('express');
const router = express.Router();
const util = require('util');
const db = require('../utils/database');

// Promesas nativas
const query = util.promisify(db.query).bind(db);

/* Obtener listado de proveedor. */
router.get('/', async (req, res, next) => {
  const result = await query('SELECT nit, razon_social, telefono, direccion FROM proveedor WHERE activo = 1');
  res.render('admin/proveedores', { proveedores: result, layout: 'admin', title: 'Proveedores' })
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

  var { nit, razon_social, telefono, direccion } = req.body;
  try {
    const result = await query("INSERT INTO proveedor (nit, razon_social, telefono, direccion) VALUES (?, ?, ?, ?)", [nit, razon_social, telefono, direccion]);           
    res.json(result);
  } catch (error) {
    console.log('Error =>', error);
    res.send(error.sqlMessage);
  }
});

/* Actualizar proveedor. */
router.put('/:id', async (req, res, next) => {

  console.log(req.body);
  var { nit, razon_social, telefono, direccion } = req.body;
                                                 
  try {
    const result = await query(`UPDATE proveedor SET  nit = ${nit}, razon_social = '${razon_social}', telefono = ${telefono},  direccion = '${direccion}' WHERE id_proveedor = ${req.params.id}`);           
    res.json(result);
  } catch (error) {
    console.log('Error =>', error);
    res.send(error.sqlMessage);
  }
});

/* Eliminar proveedor. */
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await query(`DELETE FROM proveedor WHERE id_proveedor = ${req.params.id} AND activo = 0`);      
    res.json(result);     
  } catch (error) {
    console.log('Error =>', error);
    res.send(error.sqlMessage);
  }
});

module.exports = router;