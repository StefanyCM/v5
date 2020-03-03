var express = require('express');
var router = express.Router();
const util = require('util');
const db = require('../utils/database');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

// Promesas nativas
const query = util.promisify(db.query).bind(db);

router.get('/', async function (req, res, next) {
  return MongoClient.connect(url, async (err, client) => {
    let auditoria = await client.db('compunet').collection('auditoria').find({}).toArray(function (err, docs) {
      console.log(docs)
      res.render('admin/backups', {layout: 'admin', data: docs });
    });
    client.close();
  });
});

router.get('/backup', async (req, res, next) => {
  return MongoClient.connect(url, async (err, client) => {
    console.log("Connected successfully to server");
    const result = await query('SELECT * FROM auditoria');

    result.forEach(i => {
      switch (i.operacion) {
        case 'actualizacion':
          client.db('compunet').collection('auditoria').updateMany({ _id: i.id }, {
            $set: {
              tabla: i.tabla,
              operacion: i.operacion,
              usuario: i.usuario,
              fecha: i.fecha,
              valorAnterior: i.valorAnterior,
              valorActual: i.valorActual
            }
          }, { upsert: true }
          )
          break;
        case 'insercion':
          client.db('compunet').collection('auditoria').updateMany({ _id: i.id }, {
            $set: {
              tabla: i.tabla,
              operacion: i.operacion,
              usuario: i.usuario,
              fecha: i.fecha,
              valorActual: i.valorActual
            }
          }, { upsert: true }
          )
          break;
        case 'elimiacion':
          client.db('compunet').collection('auditoria').updateMany({ _id: i.id }, {
            $set: {
              tabla: i.tabla,
              operacion: i.operacion,
              usuario: i.usuario,
              fecha: i.fecha,
              valorAnterior: i.valorAnterior,
            }
          }, { upsert: true }
          );
      }
    });

    client.close();

  });
});

module.exports = router;
