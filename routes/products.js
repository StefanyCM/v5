var express = require('express');
var router = express.Router();
const util = require('util');
const db = require('../utils/database');

// Promesas nativas
const query = util.promisify(db.query).bind(db);

//insertar producto e item 

router.post('/', async function(req, res, next) {
  let { nombre, descripcion, imagen, precio, marca, categoria, items } = req.body;

  try {
    await db.getConnection((err, conn) => {
      if (err) {
          if (callback) callback(err, null);
          return;
      }
      conn.beginTransaction(function(err) {
        if (err) { throw err; }
        conn.query(`INSERT INTO producto (nombre, descripcion, imagen, precio_venta, fk_id_marca, fk_id_categoria) VALUES ('${nombre}', '${descripcion}', '${imagen}', ${precio}, ${marca}, ${categoria})`, function(err, result) {
          if (err) { 
            console.log(err);
            conn.rollback(function() {
              throw err;
            });
          }
          console.log(result);

          var log = result.insertIdtraer;

          for (var i = 1; i < req.body.items.length; i++) {
            
            var { referencia, precio_compra, proveedor } = req.body.items[i-1];

            conn.query(`INSERT INTO item (referencia, precio_compra, fk_proveedor, fk_id_producto, fecha) VALUES ('${referencia}', ${precio_compra}, ${proveedor}, ${log}, '${new Date().toJSON().slice(0, 19).replace('T', ' ')}')`, function(err, result) {
              if (err) { 
                console.log
                conn.rollback(function() {
                  throw err;
                });
              }  
              if(i = req.body.items.length) {

                conn.commit(function(err) {
                  if (err) { 
                    conn.rollback(function() {
                      throw err;
                    });
                  }
                  console.log('Transaction Complete.');
                  conn.release();
                });
              }
            })
          };
        });
      });
    });

  } catch (error) {
    console.log(error);
  } 
});

/* Obtener productos */
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
  var { nombre, descripcion, imagen, precio_venta, marca, categoria} = req.body;
  try {
    const result = await query(`UPDATE producto SET nombre = '${nombre}', descripcion = '${descripcion}', imagen = '${imagen}', precio_venta = ${precio_venta}, fk_id_marca = ${marca}, fk_id_categoria = ${categoria} WHERE id_producto = ${req.params.id}`);           
    res.json(result);
  } catch (error) {
    console.log('Error =>', error);
    res.send(error.sqlMessage);
  }
});

//traer los productos de items 
router.get('/', async (req, res, next) => {
  const result = await query('SELECT producto.id_producto, producto.nombre, producto.descripcion, producto.imagen, producto.disponible, producto.precio_venta, Count(*) AS cantidad, marca.nombre AS marca, categoria.nombre AS categoria FROM producto INNER JOIN item INNER JOIN marca ON producto.fk_id_marca = marca.id_marca INNER JOIN categoria ON producto.fk_id_categoria = categoria.id_categoria WHERE producto.id_producto = item.fk_id_producto AND item.estado = "disponible" GROUP BY producto.id_producto');
  res.json(result);
});

module.exports = router;