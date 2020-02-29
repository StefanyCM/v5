const express = require('express');
const router = express.Router();
const util = require('util');
const db = require('../utils/database');

// Promesas nativas
const query = util.promisify(db.query).bind(db);

/* Obtener listado de usuarios. */
router.get('/', async (req, res, next) => {
  const result = await query('SELECT * FROM usuario');
  res.json(result);
});


module.exports = router;
