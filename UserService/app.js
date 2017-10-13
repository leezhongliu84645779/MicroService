const express = require('express');
const app = express();
const port = "3000";
const server = app.listen(port);
const routes = require('./api/routes/index.js');
const config = require('./api/data/dbconfig.js');
const logger = function(req, res, next) {
  console.log("A new request is received");
  next();
}
app.use(logger);
app.use('/ecommerce/api/v0', routes);
