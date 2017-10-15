const express = require('express');
const app = express();
const router = express.Router();
const userAuthentication = require('../authentication/authentication.js').userAuthentication;
const userAuthorization = require('../authorization/authorization.js').userAuthorization;
const RateLimiting = require('../ratelimiting/rateLimitingReader.js').RateLimiting;
var checkAccessRights = function(req, res) {
  var authentication = userAuthentication(req, res);
  if (authentication[0]) {
      if (userAuthorization(authentication[1], "user")) {
        return res.send("201");
      }
      return res.send("403");
  }
  return res.send("401");
}

//We fist authenticate the user and then authorize the user. If the user is both
//authenticated and authorized, we do the http proxy.
router
  .route('/session')
  .post(function(req, res) {
    var ip = req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
    var ratelimiting = new RateLimiting("POST", "/session", ip)
    if (ratelimiting.rateLimitingOperationAllowed) {
      if (ratelimiting.checkPermission()) {
        checkAccessRights(req, res);
      } else {
        console.log("you have already visited this API for too many times. No further operation is allowed");
        return res.send("403");
      };
    } else {
      console.log("We don't have to check the ratelimiting for this API");
      checkAccessRights(req, res);
    }    
  });




module.exports = router;
