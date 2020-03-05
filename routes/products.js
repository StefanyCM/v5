var express = require('express');
var router = express.Router();
const util = require('util');
const db = require('../utils/database');
const upload = require('../utils/multer-storage');

// Promesas nativas
const query = util.promisify(db.query).bind(db);

//insertar producto e item 
router.post('/', upload.single('imagen'), async function (req, res, next) {
  let { nombre, descripcion, imagen, precio, marca, categoria, oferta } = req.body;
  try {
    await query(`INSERT INTO producto (nombre, descripcion, imagen, precio_venta, fk_id_marca, fk_id_categoria, oferta) VALUES ('${nombre}', '${descripcion}', '${req.file.filename}', ${precio}, ${marca}, ${categoria}, ${oferta})`, function (err, result) {
      if (err) {
        console.log(err);
      }
      res.json(result);
    });
  } catch (error) {
    console.log(error);
  }
});

/* Obtener detalle de producto */
router.get('/:id', async (req, res, next) => {
  try {
    const result = await query(`SELECT producto.id_producto, producto.nombre, producto.descripcion, producto.imagen, producto.disponible, producto.precio_venta, ( SELECT COUNT( * ) FROM item WHERE item.fk_id_producto = ${req.params.id} AND estado = "disponible" ) AS cantidad, categoria.nombre AS categoria, marca.nombre AS marca FROM producto INNER JOIN marca ON producto.fk_id_marca = marca.id_marca INNER JOIN categoria ON producto.fk_id_categoria = categoria.id_categoria WHERE producto.id_producto = ${req.params.id}`);
    res.json(result);
  }
  catch (error) {
    console.log('Error =>', error);
    res.send(error.sqlMessage);
  }
});

/* Actualizar un productos. */
router.put('/:id', async (req, res, next) => {
  var { nombre, descripcion, imagen, precio_venta, marca, categoria } = req.body;
  try {
    const result = await query(`UPDATE producto SET nombre = '${nombre}', descripcion = '${descripcion}', imagen = '${imagen}', precio_venta = ${precio_venta}, fk_id_marca = ${marca}, fk_id_categoria = ${categoria} WHERE id_producto = ${req.params.id}`);
    res.json(result);
  } catch (error) {
    console.log('Error =>', error);
    res.send(error.sqlMessage);
  }
});

//Listar productos
router.get('/', async (req, res, next) => {
  const result = await query('SELECT producto.id_producto, producto.nombre, producto.descripcion, producto.imagen, producto.disponible, producto.precio_venta, Count(*) AS cantidad, marca.nombre AS marca, categoria.nombre AS categoria FROM producto INNER JOIN item INNER JOIN marca ON producto.fk_id_marca = marca.id_marca INNER JOIN categoria ON producto.fk_id_categoria = categoria.id_categoria WHERE producto.id_producto = item.fk_id_producto AND item.estado = "disponible" GROUP BY producto.id_producto');
  const categorias = await query('SELECT * FROM categoria');
  const marcas = await query('SELECT * FROM marca');
  const proveedor = await query('SELECT * FROM proveedor');
  res.render('admin/products', { productos: result, categorias: categorias, marcas: marcas, proveedor: proveedor, layout: 'admin', title: 'Productos' })


});

module.exports = router;