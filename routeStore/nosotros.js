var express = require('express');
var router = express.Router();
const util = require('util');
const db = require('../utils/database');

// Promesas nativas
const query = util.promisify(db.query).bind(db);
/* GET home page. */
  router.get('/',async function(req, res, next) {
    const categorias = await query('SELECT * FROM categoria');
    const marcas = await query('SELECT * FROM marca');
  
   res.render('nosotros', {categorias: categorias, marcas:marcas, layout: 'main', title: 'Dashboard'});
});

module.exports = router;