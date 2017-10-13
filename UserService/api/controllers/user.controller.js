const validator = require('payload-validator');
const automatedContractValidator = require('../common/validationAutomation.js').automatedContractValidator;
const userModel = require("../data/model/user.model.js");

module.exports.createUser = function(req, res) {
  const functionName = "createUser";
  const payload = req.body;
  const payloadCheckResult = automatedContractValidator(validator, payload, functionName);
  if (payloadCheckResult.success) {
    console.log("payloadCheck is passed");
    userModel.saveUser(payload).then(function(user) {
      console.log("post request is success");
      res.sendStatus("201");
    }).catch(function(err) {
        console.log("database error");
        console.log(err);
        res.sendStatus("500");
    })
  } else{
    console.log("payload doesn't have the correct format");
    res.sendStatus("400");
  }
}

module.exports.getUser = function(req, res) {
  console.log("trying to get one users from database");
  console.log("req is", req);
  res.send("hello world");
}

module.exports.getUsers = function(req, res) {
  userModel.findAllUser().then(function(user){
    console.log("user is");
    console.log(user);
    res.sendStatus("200");
  }).catch(function(err){
    console.log("cannot find the user");
    console.log(err);
    res.sendStatus("500");
  })
}
