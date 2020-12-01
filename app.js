var createError = require('http-errors');
var express = require('express');
var hbs = require('express-handlebars')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');

var indexRouter = require('./Services/routes/index');
var incomesRouter = require('./Services/routes/income');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'Presentation/views'));
app.engine( 'hbs', hbs( {
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: __dirname + '/Presentation/views/layouts/',
  partialsDir: __dirname + '/Presentation/views/partials/'
} ) );
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'Presentation/public'),
  dest: path.join(__dirname, 'Presentation/public'),
  debug: true,
  outputStyle: 'compressed'
}));
app.use(express.static(path.join(__dirname, 'Presentation/public')));

app.use('/', indexRouter);
app.use('/income', incomesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
