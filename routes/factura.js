var express = require('express');
var router = express.Router();
const util = require('util');
const db = require('../utils/database');
const joinjs = require('join-js')
const _facturaMap = require('../utils/factura.map');

// Promesas nativas
const query = util.promisify(db.query).bind(db);

/*Consultar todas las facturas. */
router.get('/', async (req, res, next) => {
  try {
    const result = await query("SELECT usuario.nombres, usuario.apellidos, pedido.total, factura.fecha, pedido.completado FROM factura INNER JOIN pedido ON factura.fk_ipedido = pedido.id_pedido INNER JOIN usuario ON pedido.fk_usuario = usuario.id_usuario");
    
    res.render('admin/factura', { facturas: result, layout: 'admin', title: 'Factura' })
    
  } catch (error) {
    console.log(error);
  } 
});


router.post('/', async function (req, res, next) {
  try {
    await db.getConnection((err, conn) => {
      if (err) {
        if (callback) callback(err, null);
        return;
      }
      //Inicia la transacción
      conn.beginTransaction( async function(err) {
        if (err) { throw err; }
        await conn.query(`INSERT INTO factura (fk_ipedido) VALUES ('${req.body.pedido}')`, async (err, result) => {
          if (err) { 
            conn.rollback(() => {
              throw err;
            });
          }
          //Retorna el id de la factura que se acaba de insertar
          var id_factura = result.insertId;
          /*Llama un procedimiento almacenado para que inserte el detalle de la factura
            El procedimiento recibe como parámetros el id de la factura y el id del pedido.
            El procedimiento contiene un cursor que obtiene los productos y cantidades del detalle del pedido para saber cuales items debe agregar al detalle de la factura
          */
          await conn.query(`CALL pdetalle_factura(${id_factura}, ${req.body.pedido})`, async (err, result) => {
            if(err){
              conn.rollback(() => {
                throw err;
              });
            }
          });
          await conn.commit(async function (err) {
            if (err) {
              await conn.rollback(async function () {
                throw err;
              });
            }
            await conn.release();
            res.json(result);
          });
        });
      });
    });
  } catch (error) {
    console.log(error);
  } 
});


/*Detalle de factura. */
router.get('/:id', async (req, res, next) => {
  const result = await query(
    "SELECT\n" +
    "factura.id_factura AS pedido_id,\n" +
    "factura.fecha AS pedido_fecha_factura,\n" +
    "pedido.completado AS pedido_estado,\n" +
    "pedido.total AS pedido_monto,\n" +
    "pedido.fecha AS pedido_fecha_pedido,\n" +
    "usuario.cedula AS pedido_cliente_cedula,\n" +
    "usuario.nombres AS pedido_cliente_nombres,\n" +
    "usuario.apellidos AS pedido_cliente_apellidos,\n" +
    "usuario.telefono AS pedido_cliente_telefono,\n" +
    "usuario.mail AS pedido_cliente_mail,\n" +
    "item.referencia AS producto_id,\n" +
    "producto.descripcion AS producto_descripcion,\n" +
    "categoria.nombre AS producto_categoria,\n" +
    "producto.nombre AS producto_nombre,\n" +
    "producto.imagen AS producto_imagen,\n" +
    "producto.precio_venta AS producto_precio,\n" +
    "marca.nombre AS producto_marca,\n" +
    "pago.id_pago AS pago_id,\n" +
    "pago.monto AS pago_monto,\n" +
    "pago.fecha AS pago_fecha,\n" +
    "pago.referencia AS pago_referencia\n" +
    "FROM\n" +
    "factura\n" +
    "INNER JOIN pedido ON factura.fk_ipedido = pedido.id_pedido AND '' = ''\n" +
    "INNER JOIN usuario ON pedido.fk_usuario = usuario.id_usuario\n" +
    "INNER JOIN detalle_factura ON detalle_factura.fk_factura = factura.id_factura\n" +
    "INNER JOIN item ON detalle_factura.fk_item = item.id_item\n" +
    "INNER JOIN producto ON item.fk_id_producto = producto.id_producto\n" +
    "INNER JOIN marca ON producto.fk_id_marca = marca.id_marca\n" +
    "INNER JOIN categoria ON producto.fk_id_categoria = categoria.id_categoria\n" +
    "INNER JOIN pago ON pago.fk_factura = factura.id_factura\n" +
    "WHERE\n" +
    "factura.id_factura = ?", [req.params.id],
  );
  let join = await joinjs.default.map(result, _facturaMap, 'facturaMap', 'pedido_');
  res.json(join);
});


module.exports = router;