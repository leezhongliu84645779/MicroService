const rateLimitingSetting = require('../data/ratelimiting/rateLimitingSetting.model.js');
const rateLimitingGeneralInfo = require('../data/ratelimiting/rateLimitingGeneralInfo.model.js');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
class RateLimiting {
  constructor(methodType, url, ip){
    console.log("entering the constructor");
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

  updateRateLimitingGeneralInfo(){
    const query = {'referenceId' : this._referenceId, 'IP' : this._ip}
    const updatedData = {
      'referenceId' : this._referenceId,
      'IP' : this._ip,
      'lastRefillTime' : this._lastRefillTime,
      'totalBucket' : this._totalBucket,
    }
    rateLimitingGeneralInfo.findOneAndUpdate(query, updatedData, {upsert:true}, function(err, doc){
      if (err) {
        console.log("fail to update the database");
      }
      console.log("succesfully update the database");
    });
  }

  loadRateLimitingData(methodType, url, ip) {
    const referenceId = url + methodType;
    console.log("enter loadRateLimitingData");
    return new Promise((resolve, reject) => {
      rateLimitingSetting.findRateLimitingSettingByReferenceId(referenceId).then((info) => {
      console.log("The setting we found from the database is");
      console.log(info);
      if (info.length > 0) {
        this._referenceId = referenceId;
        this._ceiling = info.ceiling;
        this._rate = info.rate;
        console.log("we have rateLimitingSetting for this API");
        rateLimitingGeneralInfo.findRequestRateLimitingGeneralInfo(referenceId, ip).then((info) => {
          this._ip = ip
          if (rateLimitingGeneralInfo) {
            this._lastRefillTime = rateLimitingGeneralInfo.lastRefillTime;
            this._totalBucket = rateLimitingGeneralInfo.totalBucket;
            this._newRateLimitingInfo = false;
          } else {
            this._lastRefillTime = Date.now();
            this._totalBucket = this._ceiling;
            this._newRateLimitingInfo = true;
          }
          resolve(true);
        }).catch((err) => {
          console.log("something wrong happens when trying to get the setting data");
          console.log(err);
          reject(false);
        })
      } else {
        console.log("we don't have rateLimitingSetting for this API")
        resolve(false);
      }
    }).catch((err) => {
      console.log("something wrong happens when trying to get the setting data");
      console.log(err);
      reject(false);
    })
  }
  )}

  // loadRateLimitingGeneralInfo(referenceId, ip) {
  //   console.log("for some weird reason function still go inside here");
  //   rateLimitingGeneralInfo.find({rateLimitingId : referenceId, IP : ip}).exec().then(function(rateLimitingGeneralInfo) {
  //     this._ip = ip
  //     if (rateLimitingGeneralInfo) {
  //       this._lastRefillTime = rateLimitingGeneralInfo.lastRefillTime;
  //       this._totalBucket = rateLimitingGeneralInfo.totalBucket;
  //       this._newRateLimitingInfo = false;
  //     } else {
  //       this._lastRefillTime = Date.now();
  //       this._totalBucket = this._ceiling;
  //       this._newRateLimitingInfo = true;
  //     }
  //   }).catch(function(err){
  //     console.log("fail to load the data");
  //   });
  // }

//   loadRateLimitingSetting(referenceId) {
//     console.log("enter loadRateLimitingSetting");
//     return new Promise(function(resolve, reject){
//       rateLimitingSetting.find({referenceId : referenceId}).exec().then(function(rateLimitingSetting) {
//         if (rateLimitingSetting) {
//           this._referenceId = referenceId;
//           this._ceiling = rateLimitingSetting.ceiling;
//           this._rate = rateLimitingSetting.rate;
//           this._rateLimitingAllowed = true;
//           console.log("we have rateLimitingSetting for this API");
//           resolve(true);
//         } else {
//           console.log("we don't have ratelimiting setting for this API");
//           this._rateLimitingAllowed = false;
//           reject(false);
//         }
//       }).catch(function(err){
//         console.log("fail to load the setting data");
//         this._rateLimitingAllowed = false;
//         reject(false);
//       });
//   });
// }

  checkRefill() {
    //check the time difference in minutes between the current time and last refill time
    const timeDifference = this.timeDifferenceInMinutes(Date.now, this._lastRefillTime)
    if (timeDifference > this._rate && this._totalBucket <= this._ceiling){
        this.refillBucket();
        return true;
    }
    return false;
  }

  timeDifferenceInMinutes(date1, date2) {
    console.log("find time difference");
    console.log(date1);
    console.log(date2);
    const timeDifference = date1.getTime() - date2.getTime(); // This will give difference in milliseconds
    return Math.round(timeDifference / 60000);
  }

  refillBucket() {
    this._totalBucket = Math.min(this._totalBucket + timeDifference / rate, this._ceiling);
    this._lastRefillTime = Date.now;
  }

  rateLimitingOperationAllowed() {
    return this.loadRateLimitingData(this._methodType, this._url, this._ip);
  }
}

module.exports.RateLimiting = RateLimiting;
