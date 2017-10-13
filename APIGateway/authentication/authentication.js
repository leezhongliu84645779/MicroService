const findUserFromServer = require('./authentication.util.js').findUserFromServer;
const validateJWT = require('./authentication.util.js').validateJWT;
const extractJWT = require('./authentication.util.js').extractJWT;






const login = function() {

}

const signup = function() {


}

const apiKeyGenerator = function() {

}



module.exports.userAuthentication = function(req, res) {
  return extractJWT(req, res, function(err, token) {
    if (err) {
      console.log("invalid token format is happening");
      return [false, null];
    }
    return validateJWT(token, function(err, decoded) {
      if (err) {
        console.log("token not authenticated");
        return [false, null];
      }
      console.log("token authenticated");
      return [true, decoded];
    })

  })
}
