const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const userController = require('../controllers/user.controller.js');
const router = express.Router();

app.use(urlencodedParser);
app.use(jsonParser);


router
  .route('/users')
  .get(urlencodedParser, userController.getUsers)

router
  .route('/user')
  .post(urlencodedParser, userController.createUser)

module.exports = router;
