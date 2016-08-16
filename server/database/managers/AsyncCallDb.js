var AsyncModel = require('./../models/async_call');
var db = require('./dbInit').goose;

function AsyncCallDbManager() {

  var self = this;
  
  this.parseThenInsert = function (url, date) {
    return new Promise(function (resolve, reject) {
      var async_call_obj = {
        date: date
      };
      var url_split = url.split('?');
      if (url_split.length !== 2) reject();
      else {
        async_call_obj.job_creator.base_url = url_split[0];
        async_call_obj.job_checker = async_call_obj.job_creator.base_url + '/result';
        var url_slash_split = url_split[0].split('/');
        async_call_obj.name = url_slash_split[url_slash_split.length - 1];
        var params = url_split[1].split('&');
        async_call_obj.job_creator.parameters = [[]];
        params.map(function (param) {
          var param_pair = param.split('=');
          var param_obj = { name: param_pair[0], value: param_pair[1] };
          async_call_obj.job_creator.parameters[0].push(param_obj);
        });
        self.insertAsyncCall(async_call_obj).then(function () {
          resolve();
        });
      }
    });
  };

  this.insertAsyncCall = function (call_obj) {
    return new Promise(function (resolve, reject) {
      var async_model = new AsyncModel(call_obj);
      async_model.save(function (err, saved_obj) {
        if (err) {
          console.error(err);
          reject();
        } else {
          resolve();
        }
      });
    })
  };
  
  this.retrieveAsyncCall = function () {
    return new Promise(function (resolve, reject) {
      AsyncModel.find(function (err, found_calls) {
        if (err) {
          console.error(err);
          reject();
        } else {
          resolve(found_calls);
        }
      });
    });
  };

  this.retrieveACall = function (url) {
    return new Promise(function (resolve) {
      var base_url = url.split('?')[0];
      AsyncModel.findOne({'job_creator.base_url': base_url}, function (found_call) {
        resolve(found_call);
      })
    });
  }
}

module.exports = AsyncCallDbManager;