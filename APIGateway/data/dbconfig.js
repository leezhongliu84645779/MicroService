var mongoose = require('mongoose');
var dburl = 'mongodb://localhost:27017/APIGateWay';
mongoose.connect(dburl);
mongoose.connection.on('connected', function(){
  console.log("Mongoose connected to " + dburl);
});

mongoose.connection.on('disconnected', function(){
  console.log("Mongoose disconnected from " + dburl)
});

mongoose.connection.on('err', function(err) {
  console.log("Mongoose connection error, "  + err)
});
