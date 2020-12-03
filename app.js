var createError = require('http-errors');
var express = require('express');
var hbs = require('express-handlebars')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var bodyParser = require('body-parser');
require('dotenv/config');



var indexRouter = require('./services/routes/index');
var incomesRouter = require('./services/routes/incomes');
var usersRouter = require('./services/routes/users');
var userGroupsRouter = require('./services/routes/userGroups');

var app = express();

app.use(bodyParser.json());
// view engine setup
app.set('views', path.join(__dirname, 'presentation/views'));
app.engine( 'hbs', hbs( {
  extname: 'hbs',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  },
  defaultLayout: 'main',
  layoutsDir: __dirname + '/presentation/views/layouts/',
  partialsDir: __dirname + '/presentation/views/partials/'
} ) );
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'presentation/public'),
  dest: path.join(__dirname, 'presentation/public'),
  debug: true,
  outputStyle: 'compressed'
}));
app.use(express.static(path.join(__dirname, 'presentation/public')));

app.use('/', indexRouter);
app.use('/income', incomesRouter);
app.use('/users', usersRouter);
app.use('/userGroups', userGroupsRouter);

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

//Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = process.env.DB_CONNECTION;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true},() => console.log('connected to db!'));
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = app;
