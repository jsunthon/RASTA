'use strict';
var visualServApp = angular.module('visualServApp', ['ngRoute',
  'charts', 'upload', 'login', 'addUser', 'addEmail']);

//register the navBarService
visualServApp.service('navBarService', function () {
  this.userName = "";

  this.setUserName = function (name) {
    this.userName = name.charAt(0).toUpperCase() + name.slice(1);
  }
  this.loggedIn = false; // not logged in
});

visualServApp.service('lastUpdateService', function () {
  this.lastUpdated = "";

  this.setUpdated = function(updated) {
    this.lastUpdated = updated;
  }
});

visualServApp.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when('/home', {
      templateUrl: '../views/partials/charts.html',
      controller: 'chartCtrl'
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
    .when('/addUser', {
      templateUrl: '../views/partials/addUser.html',
      controller: 'addCtrl'
    })
    .when('/addEmail', {
      templateUrl: '../views/partials/emails.html',
      controller: 'emailCtrl'
    }).when('/unauth', {
        templateUrl: '../views/partials/unauth.html'
      })
    .otherwise({
      redirectTo: '/home'
    });
}]);

visualServApp.controller('navbarCtrl', ['$scope', '$cookies', '$http', 'navBarService', function ($scope, $cookies, $http, navBarService) {

  if ($cookies.get('token') && $cookies.get('name')){
    $http.get('/api/validateUser').then(function(response) {
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

visualServApp.controller('lastUpdateCtrl', ['$scope', 'lastUpdateService', function ($scope, lastUpdateService) {
  $scope.$watch(function() {
    return lastUpdateService.lastUpdated;
  }, function (newValue) {
    $scope.currTime = newValue;
  }, true);
}]);

