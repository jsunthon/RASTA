'use strict';
var visualServApp = angular.module('visualServApp', ['ngRoute',
  'charts', 'upload', 'login', 'addUser', 'addEmail', 'testFunctions', 'testService', 'testOverall', 'tickets', 'editServices']);

//register the navBarService
visualServApp.service('navBarService', function () {
  this.userName = "";

  this.setUserName = function (name) {
    this.userName = name.charAt(0).toUpperCase() + name.slice(1);
  }

  this.loggedIn = false; // not logged in
});

visualServApp.service('validateUserService', function ($http, $location) {
  this.validateUser = function () {
    return $http.get('/api/validateUser').then(function (response) {
      if (response.data.success) {
        return true;
      }
    }, function (error) {
      $location.path('/unauth');
      return false;
    });
  }
});

visualServApp.service('testUtilities', function () {
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

visualServApp.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when('/home', {
      templateUrl: '../views/partials/charts.html',
      controller: 'chartCtrl'
    })
    .when('/testFunctions', {
      templateUrl: '../views/partials/testFunctions.html',
      controller: 'testFunctionsCtrl'
    })
    .when('/testService', {
      templateUrl: '../views/partials/testService.html',
      controller: 'testServiceCtrl'
    })
    .when('/testOverall', {
      templateUrl: '../views/partials/testOverall.html',
      controller: 'testOverallCtrl'
    })
    .when('/about', {
      templateUrl: '../views/partials/about.html'
    })
    .when('/upload', {
      templateUrl: '../views/partials/upload.html',
      controller: 'uploadCtrl'
    })
    .when('/userGuide', {
      templateUrl: '../views/partials/user-guide.html'
    })
    .when('/login', {
      templateUrl: '../views/partials/login.html',
      controller: 'loginCtrl'
    })
    .when('/login/:addedUser', {
      templateUrl: '../views/partials/login.html',
      controller: 'loginCtrl'
    })
    .when('/logout', {
      templateUrl: '../views/partials/charts.html',
      controller: 'chartCtrl'
    })
    .when('/addUser', {
      templateUrl: '../views/partials/addUser.html',
      controller: 'addCtrl'
    })
    .when('/tickets', {
      templateUrl: '../views/partials/tickets.html',
      controller: 'ticketsCtrl'
    })
    .when('/addEmail', {
      templateUrl: '../views/partials/emails.html',
      controller: 'emailCtrl'
    })
    .when('/editServices', {
      templateUrl: '../views/partials/editServices.html',
      controller: 'editServicesCtrl'
    })
    .when('/unauth', {
      templateUrl: '../views/partials/unauth.html'
    })
    .otherwise({
      templateUrl: '../views/partials/charts.html',
      controller: 'chartCtrl'
    })
}]);

visualServApp.controller('navbarCtrl', ['$scope', '$cookies', '$http', 'navBarService', function ($scope, $cookies, $http, navBarService) {

  if ($cookies.get('token') && $cookies.get('name')) {
    $http.get('/api/validateUser').then(function (response) {
      if (response.data.success) {
        navBarService.loggedIn = true;
        navBarService.setUserName($cookies.get('name'));
      }
    });
  }

  $scope.logout = function () {
    $cookies.remove('token');
    $cookies.remove('name');
    navBarService.loggedIn = false;
  }

  $scope.$watch(function () {
    return navBarService.loggedIn;
  }, function (newValue) {
    $scope.loggedIn = newValue;
  }, true);

  $scope.$watch(function () {
    return navBarService.userName;
  }, function (newValue) {
    $scope.welcomeMsg = "Welcome, " + newValue;
  }, true);
}]);



