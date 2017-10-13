const requestPromise = require('request-promise');
const jwt = require('jsonwebtoken');
const findUserAPIEndpoint = 'https://localhost:3000/ecommerce/api/v0/user/';
const envVariable = require('dotenv').config();



const getUserIdFromToken = function(token) {

}


const generateUserAuthenticationInfo = function(userId){
  return {
    uri : findUserAPIEndpoint + userId,
    headers : {
        'User-Agent': 'Request-Promise'
    },
    json : true // Automatically parses the JSON string in the response
  };
}




module.exports.validateJWT = function(token, callback) {
  const secret = process.env.SECRET;
  const jwtToken = token;
  try {
    var decoded = jwt.verify(jwtToken, secret);
    console.log("decoded is");
    console.log(decoded);
    return callback(null, decoded);
  } catch(err) {
  // err
    console.log("error is");
    console.log(err);
    return callback(err, null);
  }

}

module.exports.extractJWT = function(req, res, callback) {
  var header = req.headers;
  console.log("header is");
  console.log(header);
  var bearerToken = header.authorization;
  var tokenArray = bearerToken.split(' ');
  if (tokenArray.length != 2 || tokenArray[0] != "Bearer") {
    console.log("invalid token");
    return callback(true, null);
  }
  return callback(null, tokenArray[1]);
}


module.exports.findUserFromServer = function(token) {
  userId = getUserIdFromToken(token);
  userAuthenticationInfo = generateUserAuthenticationInfo(userId);
  requestPromise(userAuthenticationInfo)
    .then(function (user) {
        return {error: null, user: user};
    })
    .catch(function (err) {
        console.log("err happens when making the API call");
        return {err: err, user: null};
    });
};
