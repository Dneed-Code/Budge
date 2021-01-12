/**
 * Set up Mongoose connection to Atlas
 * Console Log to reflect the connection
 */


var mongoose = require('mongoose');
var mongoDB = process.env.DB_CONNECTION;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: false},() => console.log('Connected to Mongo database'));
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Configure DataMigrator
//require('./DataMigrator.js');