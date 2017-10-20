const rateLimitingSetting = require('../data/ratelimiting/rateLimitingSetting.model.js');
const rateLimitingGeneralInfo = require('../data/ratelimiting/rateLimitingGeneralInfo.model.js');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

class RateLimiting {
  constructor(methodType, url, ip){
    this._methodType = methodType;
    this._url = url;
    this._ip = ip
  }

  checkPermission() {
    this.checkRefill();
    if (this._totalBucket > 0){
      this._totalBucket -= 1;
      this.updateRateLimitingGeneralInfo();
      return true;
    }
    return false;
  }

  updateRateLimitingGeneralInfo() {
    rateLimitingGeneralInfo.updateRateLimitingGeneralInfo(this._referenceId, this._ip, this._lastRefillTime, this._totalBucket)
  }

  loadRateLimitingData(methodType, url, ip) {
    const referenceId = methodType + url;
    return new Promise((resolve, reject) => {
      rateLimitingSetting.findRateLimitingSettingByReferenceId(referenceId).then((settingInfo) => {
      if (settingInfo.length > 0) {
        this.loadRateLimitingSettingInfo(settingInfo, referenceId);
        rateLimitingGeneralInfo.findRequestRateLimitingGeneralInfo(referenceId, ip).then((generalInfo) => {
          this.loadRateLimitingGeneralInfo(generalInfo, ip);
          resolve(true);
        }).catch((err) => {
          reject(false);
        })
      } else {
        resolve(false);
      }
    }).catch((err) => {
      reject(false);
    })
  }
  )}

  loadRateLimitingGeneralInfo(info, ip) {
    this._ip = ip
    if (info.length > 0) {
      this._lastRefillTime = info[0].lastRefillTime;
      this._totalBucket = info[0].totalBucket;
      this._apiRecordExist = true;
    } else {
      this._lastRefillTime = new Date();
      this._totalBucket = this._ceiling;
      this._apiRecordExist = false;
    }
  }

  loadRateLimitingSettingInfo(info, referenceId) {
    this._referenceId = referenceId;
    this._ceiling = info[0].ceiling;
    this._rate = this.calculateRateByCeiling(this._ceiling);
  }

  checkRefill() {
    //check the time difference in minutes between the current time and last refill time
    const timeDifference = this.timeDifferenceInMinutes(new Date(), this._lastRefillTime)
    if (timeDifference > this._rate && this._totalBucket <= this._ceiling){
        this.refillBucket();
        return true;
    }
    return false;
  }

  timeDifferenceInMinutes(date1, date2) {
    if (this._apiRecordExist) {
      const timeDifference = date1.getTime() - date2.getTime(); // This will give difference in milliseconds
      return Math.round(timeDifference / 60);
    }
    return 0;
  }

  refillBucket() {
    this._totalBucket = Math.min(this._totalBucket + timeDifference / rate, this._ceiling);
    this._lastRefillTime = new Date();
  }

  rateLimitingOperationAllowed() {
    return this.loadRateLimitingData(this._methodType, this._url, this._ip);
  }

  calculateRateByCeiling(ceiling) {
    return Math.round(86400 / ceiling); //This number will give you after how many second the bucket will get refilled.
  }
}

module.exports.RateLimiting = RateLimiting;
