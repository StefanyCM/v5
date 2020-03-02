const express = require('express');
const router = express.Router();
const util = require('util');
const db = require('../utils/database');

// Promesas nativas
const query = util.promisify(db.query).bind(db);

/* Obtener listado de cateogiras. */
router.get('/', async (req, res, next) => {
  const result = await query('SELECT * FROM categoria');
  
  res.render('admin/categorias', { categorias: result, layout: 'admin' })
});

/* Obtener un categoria. */
router.get('/:id', async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM categoria WHERE id_categoria = ?', [req.params.id]);
    res.json(result);
  }
  catch (error) {
    console.log('Error =>', error);
    res.send(error.sqlMessage);
  }
});

/* Registrar categoria. */
router.post('/', async (req, res, next) => {
  console.log("AQUI ES POST")
  var { nombre } = req.body;
  try {
    const result = await query("INSERT INTO categoria (nombre) VALUES (?)", [nombre]);
    res.json(result);
  } catch (error) {
    console.log('Error =>', error);
    res.send(error.sqlMessage);
  }
});

/* Actualizar categoria. */
router.put('/:id', async (req, res, next) => {
  var {nombre} = req.body;
  try {
    const result = await query(`UPDATE categoria SET nombre = '${nombre}' WHERE id_categoria = ${req.params.id}`);           
    res.json(result);
  } catch (error) {
    console.log('Error =>', error);
    res.send(error.sqlMessage);
  }
});

/* Eliminar categoria. */
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await query(`DELETE FROM categoria WHERE id_categoria = ${req.params.id}`);      
    res.json(result);     
  } catch (error) {
    console.log('Error =>', error);
    res.send(error.sqlMessage);
  }
});

module.exports = router;