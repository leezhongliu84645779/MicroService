const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const rateLimitingSettingSchema = new Schema({
  url: {
    type: String,
    require: true,
  },
  methodType: {
    type: String,
    require: true,
  },
  rate: {
    type: Number,
    require: true,
    min: 1,
  },
  ceiling: {
    type: Number,
    require: true,
  },
  referenceId: {
    type: String,
    require: true,
    unique: true,
  },
})

const rateLimitingSetting = mongoose.model('RateLimitingSetting', rateLimitingSettingSchema);
module.exports.rateLimitingSetting = rateLimitingSetting;
