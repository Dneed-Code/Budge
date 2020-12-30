

var createError = require('http-errors');
var express = require('express');
var hbs = require('express-handlebars')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var bodyParser = require('body-parser');
require('toastr');
require('dotenv/config');
var moment = require('moment'); // require
moment().format();

//Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = process.env.DB_CONNECTION;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: false},() => console.log('connected to Mongo database'));
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


var indexRouter = require('./services/routes/index');
var incomesRouter = require('./services/routes/incomes');
var expensesRouter = require('./services/routes/expenses');
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

var exphbs = hbs.create({});
var DateFormats = {
  year: "YYYYMMDD",
  short: "DD MMMM - YYYY",
  long: "dddd DD.MM.YYYY HH:mm"
};
// register new function for formatting dates in view
exphbs.handlebars.registerHelper('formatDate', function(datetime, format) {
  if (moment) {
    // can use other formats like 'lll' too
    format = DateFormats[format] || format;
    return moment(datetime).format(format);
  }
  else {
    return datetime;
  }
});
// register new function for formatting dates paid in view
exphbs.handlebars.registerHelper('formatDatePaid', function(number) {
  var j = number % 10,
      k = number % 100;
  if (j == 1 && k != 11) {
    return number + "st";
  }
  if (j == 2 && k != 12) {
    return number + "nd";
  }
  if (j == 3 && k != 13) {
    return number + "rd";
  }
  return number + "th";
}
);
// register new function for formatting dates in view
exphbs.handlebars.registerHelper('formatEndDate', function(datetime, format) {
  var endDateNoEnd = new Date(2030, 12, 12);
  if (datetime > endDateNoEnd){
    return 'Enduring Income'
  }
  if (moment) {
    // can use other formats like 'lll' too
    format = DateFormats[format] || format;
    return moment(datetime).format(format);
  }
  else {
    return datetime;
  }
});

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
app.use('/expense', expensesRouter);
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



module.exports = app;
