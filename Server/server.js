//
// Kusema Server
//
// Written by Nathan Sherburn
// 14/03/2015
//

// Dependencies
var express        = require('express');
var path           = require('path');
var favicon        = require('static-favicon');
var logger         = require('morgan');
var cookieParser   = require('cookie-parser');
var bodyParser     = require('body-parser');
var mongoose       = require('mongoose');
var cors           = require('cors');
var passport       = require('passport');
var expressSession = require('express-session');

// Instantiate app and server
var app            = express();
var server         = require('http').createServer(app);

var here = function(pathToJoin) {
  return path.join(__dirname, pathToJoin)
}

// Configure database
var dbConfig = require(here('config/database.js'));
mongoose.connect(dbConfig.url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("MongoDB connected.")
});

// View engine setup
app.set('views', here('views'));
app.set('view engine', 'jade');

var corsOptions = {
  origin: true,
  credentials: true
}

// Configure CORs
app.use(cors(corsOptions));

// Configure Passport
require(here('config/passport'))(passport);
app.use(expressSession({ // TODO add a data store to this
	secret: 'mySecretKey',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());  

// Configure middleware
app.use(favicon(here('../Client/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(here('../Client')));

// add convenience function to autoJSON a mongoose object, probably better places to do it

app.use(function(req, res, next) {
  res.mjson = function(mongooseDocument) {
    if (mongooseDocument.toJSON) {
      res.json(mongooseDocument.toJSON());
    } else {
      res.json(mongooseDocument.map(function(realDoc) { return realDoc.toJSON();}));
    }
  };
  next();
});

// Add routes
var account = require('./routes/account')(passport);
var api 	= require('./routes/api');
var mers	= require('mers');

app.use('/account', account);
app.use('/api', api);
app.use('/rest',mers({'mongoose':mongoose}).rest());

/// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// Configure Socket IO
require(here('/config/socketio'))(server);


/// Error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


// Export server to be run from "./bin/<script>.js"
// Run "npm test" to start the server
module.exports = server;
