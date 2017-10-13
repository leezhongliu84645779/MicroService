const express = require('express');
const app = express();
const router = express.Router();
const userAuthentication = require('../authentication/authentication.js').userAuthentication;
const userAuthorization = require('../authorization/authorization.js').userAuthorization;


//We fist authenticate the user and then authorize the user. If the user is both
//authenticated and authorized, we do the http proxy.
router
  .route('/session')
  .post(function(req, res) {
    var authentication = userAuthentication(req, res);
    if (authentication[0]) {
        if (userAuthorization(req, res, "user")) {

        }
        res.send("403");
    }
    res.send("401");
  });




module.exports = router;
