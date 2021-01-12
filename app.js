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
const session = require('express-session');
const flash = require('connect-flash');
const passport = require("passport");
require('../Budge/config/passport')(passport)
var app = express();
moment().format();

// Configure Mongoose
require('../Budge/config/app/mongooseConfig');

// Require routes
var indexRouter = require('./services/routes/index');
var incomesRouter = require('./services/routes/incomes');
var expensesRouter = require('./services/routes/expenses');
var usersRouter = require('./services/routes/users');
var userGroupsRouter = require('./services/routes/userGroups');

// Use body parser
app.use(bodyParser.json());

// View engine setup
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

// View helpers hbs
require('../Budge/config/app/viewEngineHelpersConfig');

//express session
app.use(session({
  secret : 'secret',
  resave : true,
  saveUninitialized : true
}));
app.use(passport.initialize());
app.use(passport.session());
//use flash
app.use(flash());
app.use((req,res,next)=> {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error  = req.flash('error');
  next();
})


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
