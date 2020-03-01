var express = require('express');
var router = express.Router();
const util = require('util');
const db = require('../utils/database');
const joinjs = require('join-js')
const _pedidoMap = require('../utils/product.map');

// Promesas nativas
const query = util.promisify(db.query).bind(db);

//insertar producto e item 
router.post('/', async function (req, res, next) {
  let { forma_pago, productos } = req.body;

  try {
    await db.getConnection((err, conn) => {
      if (err) {
        if (callback) callback(err, null);
        return;
      }
      conn.beginTransaction(function (err) {
        if (err) { throw err; }
        conn.query(`INSERT INTO pedido (fk_usuario, fk_forma_pago, fecha) VALUES (1753, ${forma_pago}, '${new Date().toJSON().slice(0, 19).replace('T', ' ')}')`, async function (err, result) {
          if (err) {
            conn.rollback(function () {
              throw err;
            });
          }
          var log = result.insertId;

          /*[...Array(productos.length)].forEach(( _, index) => {
            console.log(index+1);
          }); */

          for (var i = 1; i <= productos.length; i++) {
            var { cantidad, producto_id } = productos[i - 1];
            await conn.query(`INSERT INTO detalle_pedido (cantidad,fk_producto, fk_pedido) VALUES (${cantidad}, ${producto_id}, ${log})`, async function (err, result) {
              if (err) {
                conn.rollback(function () {
                  throw err;
                });
              }
              if (i >= productos.length) {
                await conn.query(`UPDATE pedido SET total = (SELECT SUM(sumas.total) FROM (SELECT detalle_pedido.cantidad * producto.precio_venta AS total FROM detalle_pedido INNER JOIN producto ON detalle_pedido.fk_producto = producto.id_producto) AS sumas) WHERE id_pedido = ${log}`);
                await conn.commit(async function (err) {
                  if (err) {
                    await conn.rollback(async function () {
                      throw err;
                    });
                  }
                  await conn.release();
                  res.json(result);
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


/* Actualizar un productos. */
router.get('/:id', async (req, res, next) => {
  try {
    const result = await query(
      "SELECT\n" +
      "pedido.id_pedido AS pedido_id,\n" +
      "pedido.completado AS pedido_estado ,\n" +
      "pedido.total AS pedido_total,\n" +
      "pedido.fecha AS pedido_fecha,\n" +
      "detalle_pedido.cantidad AS producto_cantidad,\n" +
      "producto.nombre AS producto_nombre,\n" +
      "producto.id_producto AS producto_id,\n" +
      "producto.descripcion AS producto_descripcion,\n" +
      "producto.imagen AS producto_imagen,\n" +
      "categoria.nombre AS producto_categoria,\n" +
      "marca.nombre AS producto_marca,\n" +
      "producto.precio_venta AS producto_precio\n" +
      "FROM\n" +
      "pedido\n" +
      "INNER JOIN detalle_pedido ON detalle_pedido.fk_pedido = pedido.id_pedido\n" +
      "INNER JOIN producto ON detalle_pedido.fk_producto = producto.id_producto\n" +
      "INNER JOIN categoria ON producto.fk_id_categoria = categoria.id_categoria\n" +
      "INNER JOIN marca ON producto.fk_id_marca = marca.id_marca\n" +
      "INNER JOIN forma_pago ON pedido.fk_forma_pago = forma_pago.id_forma_pago\n" +
      "WHERE pedido.id_pedido = ?", [req.params.id]
    );

    let join = await joinjs.default.map(result, _pedidoMap, 'pedidoMap', 'pedido_')

    res.json(join);

  } catch (error) {
    console.log('Error =>', error);
    res.send(error.sqlMessage);
  }
});



module.exports = router;