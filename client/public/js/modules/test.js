var test = angular.module('test', ['ui.bootstrap', 'ui.scroll', 'angular-scroll-animate']);

test.service('getService', function ($http) {

  this.getServices = function () {
    return $http.get('/api/getAllServices').then(function (response) {
      return response.data;
    });
  }
});

test.service('testingService', function ($http) {
  this.testFunction = function (functionObj) {
    return $http.post('/api/testFunction', functionObj, {headers: {'Content-Type': 'application/json'}}).then(function (response) {
      return response.data;
    });
  }

  this.testService = function (serviceObj) {
    return $http.post('/api/testService', serviceObj, {headers: {'Content-Type': 'application/json'}}).then(function (response) {
      return response.data;
    });
  }

  this.testAllServices = function () {
    return $http.get('/api/testAllServices').then(function (response) {
      return response.data;
    });
  }

  this.formatOverallTestResults = function (resultsArr) {
    return resultsArr.sort(function (resultA, resultB) {
      if (resultA.serviceName > resultB.serviceName) {
        return 1;
      }
      else if (resultA.serviceName < resultB.serviceName) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  this.getCurrentlyTestedService = function () {
    return $http.get('/api/getCurrentlyTestedServices').then(function (response) {
      return response.data;
    });
  }

  Date.prototype.today = function () {
    return (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1) + "/" + ((this.getDate() < 10) ? "0" : "") + this.getDate() + "/" + this.getFullYear();
  }

  Date.prototype.timeNow = function () {
    return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
  }

  this.updateStatusIcon = function (icon, results) {
    var successful = checkForFailures(results);
    if (successful) {
      icon.innerHTML = "<i class=\"fa fa-check-circle-o\" aria-hidden=\"true\"></i>";
    } else {
      icon.innerHTML = "<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>";
    }
  }

  var checkForFailures = function (results) {
    return results.every(validateResultObj);
  }

  var validateResultObj = function (resultObj) {
    return resultObj.receivedType !== "FAIL";
  }

  this.getOverallActiveIndex = function (response) {
    var activeInd = 0;
    if (response.successes.length === 0) {
      activeInd = 1;
    }
    return activeInd;
  }
});

test.factory('getFunctions', function($http) {
  var getFunctions = function () {
    return $http.get('/api/getAllFunctions').then(function (response) {
      return response.data;
    });
  }

  var formatFuncTableData = function (response) {
    return response.map(function (res) {
      var funcName = res._id;
      var funcId = res.id;
      var serviceNames = res.services.map(function (serviceArr) {
        var serviceSingleton = serviceArr[0];
        var serviceName = serviceSingleton.name;
        return serviceName;
      }).sort();

      var serviceNamesStr = serviceNames.reduce(function (previousValue, currentValue) {
        return previousValue + ", " + currentValue;
      });

      var serviceObjArr = res.services.reduce(function (prev, curr) {
        return prev.concat(curr);
      }).sort(function (servA, servB) {
        if (servA.name > servB.name) {
          return 1;
        }
        if (servA.name < servB.name) {
          return -1;
        }
        return 0;
      });

      return {
        funcId: funcId,
        funcName: funcName,
        serviceNames: serviceNamesStr,
        services: serviceObjArr
      };
    });
  }

  var functions;

  getFunctions().then(function(response) {
    functions = formatFuncTableData(response);
  });

  return {
    get: function(index, count, success) {
      console.log(index);
      index = index <= 0 ? index + 1 : index - 1;
      success(functions.slice(index, index + count));
    }
  }
});

test.controller('testCtrl', ['$scope', '$http', '$location', '$interval', 'getService', 'testingService', 'validateUserService', 'getFunctions', function ($scope, $http, $location, $interval, getService, testingService, validateUserService, getFunctions) {
  validateUserService.validateUser().then(function (response) {
    $scope.validUser = response;
  });
  $scope.sortFunctionType = 'funcName';
  $scope.sortFunctionReverse = false;
  $scope.searchFunction = '';
  
  $scope.testFunction = function (functionObj) {
    $scope.showFunctionTestRes = false;
    $scope.functionTestResLoading = true;
    testingService.testFunction(functionObj).then(function (response) {
      $scope.functionTestResLoading = false;
      var funcTestResIcon = document.getElementById("funcTestResIcon");
      testingService.updateStatusIcon(funcTestResIcon, response);
      $scope.funcTestedName = functionObj.funcName;
      $scope.functionTestResults = response; //an array of results objs
      var testDate = new Date(response[0].testDate);
      $scope.functionTestDate = testDate.today() + ' @ ' + testDate.timeNow();
      $scope.showFunctionTestRes = true;

    });
  }

  $scope.sortServiceType = 'name';
  $scope.sortServiceReverse = false;
  $scope.searchService = '';

  getService.getServices().then(function (response) {
    $scope.services = response;
  });

  $scope.testService = function (serviceObj) {
    $scope.showServiceTestRes = false;
    $scope.serviceTestResLoading = true;
    testingService.testService(serviceObj).then(function (response) {
      $scope.serviceTestResLoading = false;
      var servTestResIcon = document.getElementById("servTestResIcon");
      testingService.updateStatusIcon(servTestResIcon, [response]);
      $scope.serviceName = response.serviceName;
      $scope.urlTested = response.urlTested;
      $scope.rspTime = response.rspTime;
      $scope.expectedRspType = response.expectedType;
      $scope.receivedRspType = response.receivedType;
      $scope.result = response.result;
      $scope.statCode = response.statusCode;
      var testDate = new Date(response.testDate);
      $scope.testDate = testDate.today() + ' @ ' + testDate.timeNow();
      $scope.showServiceTestRes = true;
    });
  }

  // store the interval promise in this variable
  var promise;

  // starts the interval
  $scope.start = function () {
    // stops any running interval to avoid two intervals running at the same time
    $scope.stop();

    // store the interval promise
    promise = $interval(function () {
      testingService.getCurrentlyTestedService().then(function (response) {
        $scope.testNo = response.num;
        $scope.testTotal = response.total;
        var progressPrcnt = (($scope.testNo / $scope.testTotal) * 100).toFixed();
        document.getElementById("overallTestProgress").style.width = progressPrcnt + '%';
        if (Number(progressPrcnt) == 100) {
          $scope.stop();
          document.getElementById("overallTestProgress").style.width = 0 + '%';
        }
      });
    }, 100);
  };

  // stops the interval
  $scope.stop = function () {
    $interval.cancel(promise);
  };

  $scope.$on('$destroy', function () {
    $scope.stop();
  });

  $scope.testAllServices = function () {
    $scope.allServiceTestResLoading = true;
    $scope.showAllServiceTestSuccesses = false;
    $scope.showAllServiceTestFailures = false;
    testingService.testAllServices().then(function (response) {
      $scope.allServiceTestResLoading = false;
      $scope.testAllServicesSuccesses = testingService.formatOverallTestResults(response.successes);
      $scope.testAllServicesFailures = testingService.formatOverallTestResults(response.failures);
      $scope.overallTestResActiveTabInd = testingService.getOverallActiveIndex(response);
      $scope.showAllServiceTestSuccesses = true;
      $scope.showAllServiceTestFailures = true;
    });

    $scope.start();
  }
}]);