const _pedidoMap = [
  {
    mapId: 'pedidoMap',
    idProperty: 'id',
    properties: ['estado', 'total', 'fecha'],
    collections: [
      { name: 'productos', mapId: 'productMap', columnPrefix: 'producto_' }
    ]
  },
  {
    mapId: 'productMap',
    idProperty: 'id',
    properties: ['nombre', 'descripcion', 'imagen', 'cantidad', 'categoria', 'marca', 'precio']
  }
]

module.exports = _pedidoMap