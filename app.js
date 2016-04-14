(function(){
  'use strict';
  var express = require('express'),
  mongoose = require('mongoose'),
  port = 7070,
  path = require('path'),
  logger = require('morgan'),
  config = require('./config/config'),
  app = express();

  app.use(express.static(path.join(__dirname, 'public')));
  app.use(logger('dev'));
  
  mongoose.connect(config.db, function(err){
    if (err) {
      console.log('Error connecting to DB');
    } else {
      console.log('Connected to DB farmhouse');
    }
  });

  app.listen(port, function(err) {
    if (err) {
      console.log('Cannot connect to port');
    } else {
      console.log('Connected to port ' + port);
    }
  });
})();
