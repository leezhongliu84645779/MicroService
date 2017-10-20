const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const rateLimitingGeneralInfoSchema = new Schema({
  IP: {
    type: String,
    require: true,
  },
  lastRefillTime: {
    type: Date,
    require: true,
  },
  totalBucket: {
    type: Number,
    require: true,
    min: 1,
  },
  rateLimitingId: {
    type: String,
    require: true,
  },
})

const rateLimitingGeneralInfo = mongoose.model('ratelimitinggeneralinfos', rateLimitingGeneralInfoSchema);



module.exports.findRequestRateLimitingGeneralInfo = function(referenceId, ip) {
  return new Promise((resolve, reject) => {
    rateLimitingGeneralInfo.find({rateLimitingId : referenceId, IP : ip}, function(err, info) {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
}

module.exports.updateRateLimitingGeneralInfo = function(referenceId, ip, lastRefillTime, totalBucket){
  const query = {'rateLimitingId' : referenceId, 'IP' : ip}
  const updatedData = {
    'rateLimitingId' : referenceId,
    'IP' : ip,
    'lastRefillTime' : lastRefillTime,
    'totalBucket' : totalBucket,
  }
  console.log("preparing to update generalInfo");
  return new Promise((resolve, reject) => {
    rateLimitingGeneralInfo.findOneAndUpdate(query, updatedData, {upsert:true}).then((info) => {
      console.log("data succesfully updated");
      resolve(true);
    }).catch((err) => {
      console.log("data not updated");
      console.log(err);
      reject(false);
    })
  });
}
