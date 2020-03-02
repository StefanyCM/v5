const express = require('express');
const router = express.Router();
const util = require('util');
const db = require('../utils/database');

// Promesas nativas
const query = util.promisify(db.query).bind(db);

/* Obtener listado de usuarios. */
router.get('/', async (req, res, next) => {
  const result = await query('SELECT * FROM usuario');
    
  res.render('admin/usuario', { usuarios: result, layout: 'admin' })
});

/* Obtener un usuario. */
router.get('/:id', async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM usuario WHERE id_usuario = ?', [req.params.id]);
    res.json(result);
  }
  catch (error) {
    console.log('Error =>', error);
    res.send(error.sqlMessage);
  }
});

/* Registrar usuario. */
router.post('/', async (req, res, next) => {
  var { cedula, nombres, apellidos, telefono, mail, password, fk_id_rol } = req.body;
  try {
    const result = await query("INSERT INTO usuario (cedula, nombres, apellidos, telefono, mail, password, fk_id_rol) VALUES (?, ?, ?, ?, ?, ?, ?)", [cedula, nombres, apellidos, telefono, mail, password, fk_id_rol]);           
    res.json(result);
  } catch (error) {
    console.log('Error =>', error);
    res.send(error.sqlMessage);
  }
});

/* Actualizar usuario. */
router.put('/:id', async (req, res, next) => {
  var { cedula, nombres, apellidos, telefono, mail, password, rol } = req.body;
  try {
    const result = await query(`UPDATE usuario SET id_usuario = ${req.params.id}, cedula = ${cedula}, nombres = '${nombres}', apellidos = '${apellidos}', telefono = '${telefono}', mail = '${mail}', password = '${password}', fk_id_rol = ${rol} WHERE id_usuario = ${req.params.id}`);           
    res.json(result);
  } catch (error) {
    console.log('Error =>', error);
    res.send(error.sqlMessage);
  }
});

/* Eliminar usuario. */
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await query(`UPDATE usuario SET activo = 0 WHERE id_usuario = ${req.params.id}`);      
    res.json(result);     
  } catch (error) {
    console.log('Error =>', error);
    res.send(error.sqlMessage);
  }
});

module.exports = router;