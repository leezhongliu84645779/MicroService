const express = require('express');
const app = express();
const router = express.Router();
const userProxy = require('./user.proxy.js');
const authenticateUser = require('../authentication/authentication.js').authenticationStrategy;


router.use(userProxy);
module.exports = router;
