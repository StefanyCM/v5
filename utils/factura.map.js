const _facturaMap = [
    {
      mapId: 'facturaMap',
      idProperty: 'id',
      properties: ['fecha_factura', 'estado', 'monto', 'fecha_pedido', 'cliente_cedula', 'cliente_nombres', 'cliente_apellidos', 'cliente_telefono', 'cliente_mail'],
      collections: [
        { name: 'productos', mapId: 'productMap', columnPrefix: 'producto_' },
        { name: 'pagos', mapId: 'pagosMap', columnPrefix: 'pago_' }
      ]
    },
    {
      mapId: 'productMap',
      idProperty: 'id',
      properties: ['nombre', 'descripcion', 'imagen', 'categoria', 'marca', 'precio']
    },
    {
      mapId: 'pagosMap',
      idProperty: 'id',
      properties: ['referencia', 'fecha', 'monto']
      }
  ]
  
  module.exports = _facturaMap