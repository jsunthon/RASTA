var superagent = require('superagent');

function Tester() {

  this.testUrl = "http://pub.lmmp.nasa.gov:8083/getAzElfromT1/LTD002=Moon,-40.92187576334105,%E2%80%A60625036199669,1,1/Sun/2016-06-15T00:00:00.000/2016-06-16T00:00:00.000/1728";

  //Execute a http get request to test availability of a function
  this.testFunction = function (functionName) {
    console.log("Testing: " + functionName);
    superagent.get(this.testUrl).end(function (err, result) {
      if (err || result.statusCode !== 200) {
        res.send(err);
      }
      else {
      }
    });
  }

  //Execute a http get request to test availability of a service
  this.testService = function (serviceName) {
    console.log("Testing: " + ServiceName);
    superagent.get(this.testUrl).end(function (err, result) {
      if (err || result.statusCode !== 200) {
        res.send(err);
      }
      else {
      }
    });
  }
}

module.exports = Tester;