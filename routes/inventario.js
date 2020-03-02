var express = require('express');
var router = express.Router();
const util = require('util');
const db = require('../utils/database');

// Promesas nativas
const query = util.promisify(db.query).bind(db);

//traer los productos de items 
router.get('/', async (req, res, next) => {
  const result = await query('SELECT item.referencia,item.fk_id_producto As idproducto,item.fk_proveedor,producto.nombre AS producto_nombre ,producto.descripcion,producto.imagen,producto.precio_venta,marca.nombre AS marca,categoria.nombre AS categoria, proveedor.razon_social AS proveedor FROM item INNER JOIN producto ON item.fk_id_producto = producto.id_producto INNER JOIN marca ON producto.fk_id_marca = marca.id_marca INNER JOIN categoria ON producto.fk_id_categoria = categoria.id_categoria INNER JOIN proveedor ON item.fk_proveedor = proveedor.id_proveedor WHERE producto.id_producto = item.fk_id_producto AND item.estado = "disponible" GROUP BY producto.id_producto');
  res.render('admin/inventario', { inventario: result, layout: 'admin' })});

module.exports = router;