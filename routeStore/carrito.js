var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('carrito', { title: 'Dashboard', layout: 'main' });
});
  
module.exports = router;