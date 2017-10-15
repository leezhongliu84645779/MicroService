const rateLimitingSetting = require('../data/ratelimiting/rateLimitingSetting.model.js').rateLimitingSetting;
const rateLimitingGeneralInfo = require('../data/ratelimiting/rateLimitingGeneralInfo.model.js').rateLimitingGeneralInfo;
class RateLimiting {
  constructor(methodType, url, ip){
    loadRateLimitingData(methodType, url, ip);
  }

  checkPermission() {
    checkRefill();
    if (this._totalBucket > 0){
      this._totalBucket -= 1;
      updateRateLimitingGeneralInfo();
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
    MyModel.findOneAndUpdate(query, updatedData, {upsert:true}, function(err, doc){
      if (err) {
        console.log("fail to update the database");
      }
      console.log("succesfully update the database");
    });
  }

  loadRateLimitingData(methodType, url, ip) {
    const referenceId = url + methodType;
    if (loadRateLimitingSetting(referenceId)) {
      loadRateLimitingGeneralInfo(referenceId, ip);
    }
  }

  loadRateLimitingGeneralInfo(referenceId, ip) {
    rateLimitingGeneralInfo.find({rateLimitingId : referenceId, IP : ip}).exec().then(function(rateLimitingGeneralInfo) {
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
    }).catch(function(err){
      console.log("fail to load the date");
    });
  }

  loadRateLimitingSetting(referenceId) {
    rateLimitingSetting.find({referenceId : referenceId}).exec().then(function(rateLimitingSetting) {
      if (rateLimitingSetting) {
        this._referenceId = referenceId;
        this._ceiling = rateLimitingSetting.ceiling;
        this._rate = rateLimitingSetting.rate;
        this._rateLimitingAllowed = true;
        return true;
      } else {
        console.log("we don't have ratelimiting setting for this API");
        this._rateLimitingAllowed = false;
        return false;
      }
    }).catch(function(err){
      console.log("fail to load the date");
      this._rateLimitingAllowed;
      return false
    });
  }

  checkRefill() {
    //check the time difference in minutes between the current time and last refill time
    const timeDifference = timeDifferenceInMinutes(Date.now, this._lastRefillTime)
    if (timeDifference > this._rate && this._totalBucket <= this._ceiling){
        refillBucket();
        return true;
    }
    return false;
  }

  timeDifferenceInMinutes(date1, date2) {
    const timeDifference = date1.getTime() - date2.getTime(); // This will give difference in milliseconds
    return Math.round(timeDifference / 60000);
  }

  refillBucket() {
    this._totalBucket = Math.min(this._totalBucket + timeDifference / rate, this._ceiling);
    this._lastRefillTime = Date.now;
  }

  rateLimitingOperationAllowed() {
    return this._rateLimitingAllowed;
  }
}

module.exports.RateLimiting = RateLimiting;
