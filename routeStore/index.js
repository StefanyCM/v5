var express = require('express');
var router = express.Router();
const util = require('util');
const db = require('../utils/database');

const query = util.promisify(db.query).bind(db);

router.get('/',async function(req, res, next) {

  var result;
  if(req.query.marca){
    console.log("si trae marca" + req.query.marca)
    result = await query('select * from producto WHERE fk_id_marca = ?', [req.query.marca]);
  } else {
    console.log("no trae marca")
    result = await query('select * from producto');
  }

 if(req.query.categoria){
  console.log("si trae categoria" + req.query.categoria)
    result = await query('select * from producto WHERE fk_id_categoria = ?', [req.query.categoria]);
  } else {
    console.log("si trae categoria" + req.query.categoria)
    result = await query('select * from producto');
  }
  const categorias = await query('SELECT * FROM categoria');
  const marcas = await query('SELECT * FROM marca');

 res.render('index', { productos: result, categorias: categorias, marcas:marcas, layout: 'main', title: 'Dashboard'});
});

module.exports = router;
