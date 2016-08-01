var availability = angular.module('availability', ['ui.scroll', 'ui.scroll.jqlite', 'ui.bootstrap']);

testService.factory('getResultsAvail', function ($http, $timeout, $rootScope) {
  var services = [];

  var refreshData = function (data) {
    services = data;
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

testService.factory('getResultsUnavail', function ($http, $timeout, $rootScope) {
  var services = [];

  var refreshData = function (data) {
    services = data;
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

availability.controller('availCtrl', ['$scope', 'validateUserService', 'servAvailDataService', '$location', 'getResultsAvail', 'getResultsUnavail',
  function ($scope, validateUserService, servAvailDataService, $location, getResultsAvail, getResultsUnavail) {

  validateUserService.validateUser().then(function (response) {
    $scope.validUser = response;
  });

  if (servAvailDataService.getServiceAvailabilityData()) {
    $scope.servicesAvail = servAvailDataService.getServiceAvailabilityData().filter(function(result) {
      return result.test_result === 2;
    });

    $scope.servicesUnavail = servAvailDataService.getServiceAvailabilityData().filter(function(result) {
      return result.test_result < 2;
    });

    getResultsAvail.refreshData($scope.servicesAvail);
    getResultsUnavail.refreshData($scope.servicesUnavail);

    $scope.showResults = true;
  }
  
}]);