var testService = angular.module('testService', ['ui.scroll', 'ui.scroll.jqlite', 'ngMaterial']);

testService.service('serviceTester', function ($http) {
  this.testService = function (serviceObj) {
    return $http.post('/api/testService', serviceObj, {headers: {'Content-Type': 'application/json'}}).then(function (response) {
      return response.data;
    });
  }
});

testService.service('serviceSearch', function() {
  var servicesArr = [];

  this.setServices = function(services) {
    servicesArr = services;
  }

  this.querySearch = function (query) {
    return query ? servicesArr.filter(createFilterFor(query)) : servicesArr;
  }

  function createFilterFor(query) {
    var lowercaseQuery = angular.lowercase(query);
    return function filterFn(service) {
      if (service) {
        return (service.name.toLowerCase().indexOf(lowercaseQuery) === 0 || service.url.toLowerCase().indexOf(lowercaseQuery) === 0);
      }
    };
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
    return getServices().then(function (response) {
      services = response;
      return services;
    });
  }

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

  return {
    get: get,
    refreshData: refreshData
  }
});

testService.controller('testServiceCtrl', ['$scope', '$http', '$location', 'getServices', 'serviceTester',
  'validateUserService', 'testUtilities', 'serviceSearch',
  function ($scope, $http, $location, getServices, serviceTester, validateUserService, testUtilities, serviceSearch) {

    validateUserService.validateUser().then(function (response) {
      $scope.validUser = response;
    });

    $scope.$on('$routeChangeSuccess', function () {
      getServices.refreshData().then(function(services) {
        serviceSearch.setServices(services);
      });
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
        $scope.receivedResponse = response.receivedResponse;
        $scope.statCode = response.statusCode;
        var testDate = new Date(response.testDate);
        $scope.testDate = testDate.today() + ' @ ' + testDate.timeNow();
        $scope.showServiceTestRes = true;
      });
    }

    $scope.querySearch = function(query) {
      return serviceSearch.querySearch(query);
    }
  }]);