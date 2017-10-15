const express = require('express');
const app = express();
const port = '9000';
const routes = require('./apiproxy/index.js');
const config = require('./data/dbconfig.js');
const logger = function(req, res, next) {
  console.log("A new request is received");
  next();
}
const server = app.listen(port);

app.use(logger);
app.use('/', routes);
