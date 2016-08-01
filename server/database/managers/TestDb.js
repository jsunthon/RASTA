var APIFunction = require('./../models/api_function.js');
var APICall = require('./../models/api_call.js');
var TestResult = require('./../models/test_result.js');
var db = require('./dbInit').goose;

function TestDbManager() {

  this.retrieveTenServices = function (skip) {
    skip = Number(skip);
    if (skip !== 0) {
      return APICall.find({}).skip(skip).limit(10).exec();
    } else {
      return APICall.find({}).limit(10).exec();
    }
  };

  /**
   * Retrieve list of all services as a promise
   *
   * Returns: a promise for the service list
   * call result.then(function(services){}) to perform tasks on services
   */
  this.retrieveServiceListIPromise = function () {
    return APICall.find({}).exec();
  };

  /**
   * Retrieve a list of all functions with at least one service
   * @returns {Promise}
   */
  this.getAllFunctions = function () {
    return new Promise(function (resolve, reject) {
      APIFunction.aggregate([
        {
          $unwind: "$services"
        },
        {
          $lookup: {
            from: 'apicalls',
            localField: "services",
            foreignField: "_id",
            as: "services"
          }
        },
        {
          $group: {
            _id: "$name",
            id: {
              $first: "$_id"
            },
            services: {$addToSet: "$services"}
          }
        }
      ], function (err, results) {
        if (err) return console.error(err);
        else {
          var functionsWithServices = results.filter(function(result) {
            result.services = result.services.filter(function(innerArr) {
              return innerArr.length > 0;
            });
            return result.services.length > 0;
          });
          resolve(functionsWithServices);
        }
      });
    });
  }

  /**
   * Saves the results of a service api test to the database
   * @param call_url
   *                The URL of the service
   * @param call_result
   *                 1 if successful, 0 if not.
   * @param epoch_seconds
   *                Unix time in seconds since Jan 1, 1970
   */
  this.insertTestResult = function (call_url, call_result, response_time, status_code, epoch_seconds) {
    return new Promise(function (resolve, reject) {
      if (db.readyState === 1) {
        APICall.findOne({url: call_url}, function (err, found_call) {
          if (err) return console.error(err);
          if (found_call == null) return console.error('call not found');
          else {
            var test_result = new TestResult(
              {
                service_id: found_call._id,
                service_name: found_call.name,
                test_result: call_result,
                test_date: epoch_seconds,
                status_code: status_code,
                response_time: response_time
              }
            );
            test_result.save(function (err, saved_result) {
              if (err) return console.error(err);
              if (saved_result) {
                console.log('Saved test result: ' + test_result);
              }
              resolve();
              //console.log("test result with id: " + saved_result._id + "has been saved");
            });
          }
        });
      }
    });
  };
}

module.exports = new TestDbManager();