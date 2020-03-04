var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let exphbs = require('express-handlebars');
var helpers = require('handlebars-helpers')();


// Routes Admin
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var pedidoRouter = require('./routes/pedidos');
var bodyParser = require('body-parser');
var categoriaRouter = require('./routes/categoria');
var marcaRouter = require('./routes/marca');
var proveedorRouter = require('./routes/proveedor');
var inventarioRouter = require('./routes/inventario');
var auditoriaRouter = require('./routes/auditoria');
var facturaRouter = require('./routes/factura');
var auditoriaRouter = require('./routes/auditoria');


//Routes Store

var indexRouterStore = require('./routeStore/index');
var carritoRouterStore = require('./routeStore/carrito');
var contactoRouterStore = require('./routeStore/contacto');
var nosotrosRouterStore = require('./routeStore/nosotros');
var ofertasRouterStore = require('./routeStore/ofertas');
var serviciosRouterStore = require('./routeStore/servicios');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: { ...helpers,
      toJSON : (object) => {
        return JSON.stringify(object);
      },
      ifEquals: (arg1, arg2, options) => {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
      },
      formatCurrency: (value) => {
        return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
      }
    }
  })
  
)
app.set('view engine', '.hbs')
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.raw());
app.use(bodyParser.json());


app.use('/admin/', indexRouter);
app.use('/admin/usuarios', usersRouter);
app.use('/admin/productos', productsRouter);
app.use('/admin/pedidos', pedidoRouter);
app.use('/admin/categorias', categoriaRouter);
app.use('/admin/marcas', marcaRouter);
app.use('/admin/proveedores', proveedorRouter);
app.use('/admin/inventario', inventarioRouter);
app.use('/admin/auditoria', auditoriaRouter);
app.use('/admin/factura', facturaRouter);
app.use('admin/auditoria', auditoriaRouter);




app.use('/', indexRouterStore);
app.use('/carrito', carritoRouterStore);
app.use('/contacto', contactoRouterStore);
app.use('/nosotros', nosotrosRouterStore);
app.use('/ofertas', ofertasRouterStore);
app.use('/servicios', serviciosRouterStore);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
