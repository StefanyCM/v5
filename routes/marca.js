const express = require('express');
const router = express.Router();
const util = require('util');
const db = require('../utils/database');

// Promesas nativas
const query = util.promisify(db.query).bind(db);

/* Obtener listado de marca. */
router.get('/', async (req, res, next) => {
  const result = await query('SELECT * FROM marca');
  res.render('admin/marcas', { marca: result, layout: 'admin' })
});

/* Obtener un marca. */
router.get('/:id', async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM marca WHERE id_marca = ?', [req.params.id]);
    res.json(result);
  }
  catch (error) {
    console.log('Error =>', error);
    res.send(error.sqlMessage);
  }
});

/* Registrar marca. */
router.post('/', async (req, res, next) => {
  var {  nombre } = req.body;
  try {
    const result = await query("INSERT INTO marca (nombre) VALUES (?)", [nombre]);           
    res.json(result);
  } catch (error) {
    console.log('Error =>', error);
    res.send(error.sqlMessage);
  }
});

/* Actualizar marca. */
router.put('/:id', async (req, res, next) => {
  var { nombre} = req.body;
  try {
    const result = await query(`UPDATE marca SET id_marca = ${req.params.id},  nombre = '${nombre}'`);           
    res.json(result);
  } catch (error) {
    console.log('Error =>', error);
    res.send(error.sqlMessage);
  }
});

/* Eliminar marca. */
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await query(`DELETE FROM marca WHERE id_marca = ${req.params.id}`);      
    res.json(result);     
  } catch (error) {
 
    res.send(error.sqlMessage);
  }
});

module.exports = router;