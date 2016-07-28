var testService = angular.module('testService', ['ui.scroll', 'ui.scroll.jqlite']);

testService.service('serviceTester', function ($http) {
  this.testService = function (serviceObj) {
    return $http.post('/api/testService', serviceObj, {headers: {'Content-Type': 'application/json'}}).then(function (response) {
      return response.data;
    });
  }
});

testService.factory('getServices', function ($http, $timeout, $rootScope) {
  var services = [];

  var getServices = function () {
    return $http.get('/api/getAllServices').then(function (response) {
      return response.data;
    });
  }

  var refreshData = function () {
    getServices().then(function (response) {
      services = response;
      // console.log('Services num: ' + services.length);
    });
  }

  $rootScope.key_serv = "";
  var position = 0;

  var get = function (index, count, success) {
    return $timeout(function () {
      var actualIndex = index + position;
      var start = Math.max(0 - position, actualIndex);
      var end = Math.min(actualIndex + count - 1, services.length);

      if (start > end) {
        success([]);
      } else {
        success(services.slice(start, end + 1));
      }
    }, 100);
  };

  $rootScope.$watch((function () {
    return $rootScope.key_serv;
  }), function () {
    position = 0;
    for (var m = 0; m < services.length; m++) {
      if ($rootScope.key_serv > services[m]) {
        position++;
      }
    }
    if ($rootScope.key_serv)
      $rootScope.adapter.reload();
  });

  return {
    get: get,
    refreshData: refreshData
  }
});

testService.controller('testServiceCtrl', ['$scope', '$http', '$location', 'getServices', 'serviceTester', 'validateUserService', 'testUtilities',
  function ($scope, $http, $location, getServices, serviceTester, validateUserService, testUtilities) {

    validateUserService.validateUser().then(function (response) {
      $scope.validUser = response;
    });

    $scope.$on('$routeChangeSuccess', function () {
      getServices.refreshData();
    });

    $scope.testService = function (serviceObj) {
      $scope.showServiceTestRes = false;
      $scope.serviceTestResLoading = true;
      serviceTester.testService(serviceObj).then(function (response) {
        $scope.serviceTestResLoading = false;
        var servTestResIcon = document.getElementById("servTestResIcon");
        testUtilities.updateStatusIcon(servTestResIcon, [response]);
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
  }]);