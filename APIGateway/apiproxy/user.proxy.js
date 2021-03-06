const express = require('express');
const app = express();
const router = express.Router();
const userAuthentication = require('../authentication/authentication.js').userAuthentication;
const userAuthorization = require('../authorization/authorization.js').userAuthorization;
const RateLimiting = require('../ratelimiting/rateLimitingReader.js').RateLimiting;
const Promise = require('bluebird');
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

var getRequestIPAddress = function(req) {
  return req.headers['x-forwarded-for'] ||
  req.connection.remoteAddress ||
  req.socket.remoteAddress ||
  req.connection.socket.remoteAddress;
}
//We fist authenticate the user and then authorize the user. If the user is both
//authenticated and authorized, we do the http proxy.
router
  .route('/application')
  .post(function(req, res) {
     var ip = getRequestIPAddress(req);
     var ratelimiting = new RateLimiting("POST", "/application", ip);
     ratelimiting.rateLimitingOperationAllowed().then((ratelimitingAllowed) => {
       if (ratelimitingAllowed) {
         if(ratelimiting.checkPermission()) {
           console.log("ratelimiting test has passed");
           checkAccessRights(req, res);
         } else {
           console.log("you have already visited this API for too many times. No further operation is allowed");
           return res.send("403");
         }
       } else {
         console.log("no need to check the ratelimiting for this API");
         checkAccessRights(req, res);
       }
     }).catch((ratelimitingAllowed) => {
       console.log("loading data is not correct");
       checkAccessRights(req, res);
     })
   })


module.exports = router;
