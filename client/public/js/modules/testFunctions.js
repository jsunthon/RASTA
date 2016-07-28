var testFunctions = angular.module('testFunctions', ['ui.scroll', 'ui.scroll.jqlite']);

testFunctions.service('functionTester', function ($http) {
  this.testFunction = function (functionObj) {
    return $http.post('/api/testFunction', functionObj, {headers: {'Content-Type': 'application/json'}}).then(function (response) {
      return response.data;
    });
  }
});

testFunctions.factory('getFunctions', function ($http, $timeout, $rootScope) {
  var functions = [];

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

  var refreshData = function () {
    getFunctions().then(function (response) {
      functions = formatFuncTableData(response);
    });
  }

  $rootScope.key = "";
  var position = 0;

  var get = function (index, count, success) {
    return $timeout(function () {
      var actualIndex = index + position;
      var start = Math.max(0 - position, actualIndex);
      var end = Math.min(actualIndex + count - 1, functions.length);

      if (start > end) {
        success([]);
      } else {
        success(functions.slice(start, end + 1));
      }
    }, 100);
  };

  $rootScope.$watch((function () {
    return $rootScope.key;
  }), function () {
    position = 0;
    for (var m = 0; m < functions.length; m++) {
      if ($rootScope.key > functions[m]) {
        position++;
      }
    }
    if ($rootScope.key)
      $rootScope.adapter.reload();
  });

  return {
    get: get,
    refreshData: refreshData
  };
});

testFunctions.controller('testFunctionsCtrl', ['$scope', '$http', '$location', 'getFunctions', 'functionTester', 'validateUserService', 'testUtilities',
  function ($scope, $http, $location, getFunctions, functionTester, validateUserService, testUtilities) {

    validateUserService.validateUser().then(function (response) {
      $scope.validUser = response;
    });

    $scope.$on('$routeChangeSuccess', function () {
      getFunctions.refreshData();
    });

    $scope.testFunction = function (functionObj) {
      $scope.showFunctionTestRes = false;
      $scope.functionTestResLoading = true;
      functionTester.testFunction(functionObj).then(function (response) {
        $scope.functionTestResLoading = false;
        var funcTestResIcon = document.getElementById("funcTestResIcon");
        testUtilities.updateStatusIcon(funcTestResIcon, response);
        $scope.funcTestedName = functionObj.funcName;
        $scope.functionTestResults = response; //an array of results objs
        var testDate = new Date(response[0].testDate);
        $scope.functionTestDate = testDate.today() + ' @ ' + testDate.timeNow();
        $scope.showFunctionTestRes = true;
      });
    }


  }]);