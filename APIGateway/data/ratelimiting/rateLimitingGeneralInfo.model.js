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

const rateLimitingGeneralInfo = mongoose.model('rateLimitingGeneralInfo', rateLimitingGeneralInfoSchema);
module.exports.rateLimitingGeneralInfo = rateLimitingGeneralInfo;
