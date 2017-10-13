const uniqid = require('uniqid');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const payloadValidator = require('payload-validator');
const Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');
const userSchema = new Schema({
  username: {
    type: String,
    require: true,
  },
  encryptedPassword: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  referenceId: {
    type: String,
    require: true,
    unique: true,
  },
  lastLoginTime: {
    type: Date,
    default: Date.now,
  },
})

const User = mongoose.model('User', userSchema);

module.exports.saveUser = function(payload) {
  var uuid = uniqid('user-');
  payload.referenceId = uuid;
	var user = User(payload);
	return user.save();
}

module.exports.findOneUser = function(id, req) {
  User.find({uuid : id}).exec().then(function(user) {

  }).catch(function(err){

  });
}

module.exports.findAllUser = function(){
  return User.find({}).exec();
}
