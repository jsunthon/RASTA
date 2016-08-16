var testOverall = angular.module('testOverall', ['ui.bootstrap', 'ui.scroll', 'ui.scroll.jqlite']);

testOverall.service('overallTester', function ($http) {

  var testId;

  this.getTestId = function() {
    return testId;
  }

  this.setTestId = function(testIdSel) {
    testId = testIdSel;
  }

  this.testAllServices = function () {
    return $http.get('/api/testAllServices/' + testId).then(function (response) {
      return response.data;
    });
  }

  this.getServiceCount = function () {
    return $http.get('/api/getServiceCount').then(function (response) {
      return response.data;
    });
  }

  this.getUniqueTestId = function() {
    return $http.get('/api/testAllServices/genTestId').then(function(response) {
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
    return $http.get('/api/getCurrentlyTestedServices/' + testId).then(function (response) {
      return response.data;
    });
  }

  this.getOverallActiveIndex = function (response) {
    var activeInd = 0;
    if (response.successes.length === 0) {
      activeInd = 1;
    }
    return activeInd;
  }
});

testOverall.controller('testOverallCtrl', ['$scope', '$http', '$location', '$interval', 'overallTester', 'validateUserService',
  function ($scope, $http, $location, $interval, overallTester, validateUserService) {

    validateUserService.validateUser().then(function (response) {
      $scope.validUser = response;
    });

    // store the interval promise in this variable
    var promise;

    // starts the interval
    $scope.start = function () {
      // stops any running interval to avoid two intervals running at the same time
      $scope.stop();

      // store the interval promise
      promise = $interval(function () {
        overallTester.getCurrentlyTestedService().then(function (response) {
          $scope.testNo = response.num;
          $scope.testTotal = response.total;
          $scope.urlTested = response.urlTested;
          var progressPrcnt = (($scope.testNo / $scope.testTotal) * 100).toFixed();
          document.getElementById("overallTestProgress").style.width = progressPrcnt + '%';
          if (Number(progressPrcnt) == 100) {
            if (!$scope.allServiceTestResLoading) {
              document.getElementById("overallTestProgress").style.width = 0 + '%';
            }
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
      overallTester.getServiceCount().then(function(response) {
        if (response.count > 0) {
          if (document.getElementById("overallTestProgress").style.width !== 0 + '%') {
            document.getElementById("overallTestProgress").style.width = 0 + '%';
          }
          overallTester.getUniqueTestId().then(function(uniqueId) {
            overallTester.setTestId(uniqueId);
            $scope.testErrorMsg = null;
            $scope.allServiceTestResLoading = true;
            $scope.showAllServiceTestSuccesses = false;
            $scope.showAllServiceTestFailures = false;
            var startBtn = document.getElementById('startBtn');
            if (!startBtn.disabled) {
              startBtn.disabled = true;
            }
            overallTester.testAllServices().then(function (response) {
              $scope.stop();
              overallTester.setTestId(null);
              if (startBtn.disabled) {
                startBtn.disabled = false;
              }
              $scope.allServiceTestResLoading = false;
              $scope.testAllServicesSuccesses = overallTester.formatOverallTestResults(response.successes);
              $scope.testAllServicesFailures = overallTester.formatOverallTestResults(response.failures);
              $scope.overallTestResActiveTabInd = overallTester.getOverallActiveIndex(response);
              $scope.showAllServiceTestSuccesses = true;
              $scope.showAllServiceTestFailures = true;
            });
            $scope.start();
          });
        } else {
          $scope.testErrorMsg = "There are no services to test.";
        }
      });
    }

    $scope.loadServiceResult = function(serviceResult) {
      $scope.serviceResult = serviceResult;
      if ($scope.serviceResult.receivedResponse) {
        $scope.serviceResult.receivedResponse = JSON.stringify($scope.serviceResult.receivedResponse, null, 2);
      }
    }
  }]);