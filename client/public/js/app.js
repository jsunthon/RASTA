'use strict';
var visualServApp = angular.module('visualServApp', ['ngRoute',
  'charts', 'upload', 'login', 'addUser']);

//register the navBarService
visualServApp.service('navBarService', function () {
  this.userName = "";

  this.setUserName = function (name) {
    this.userName = name.charAt(0).toUpperCase() + name.slice(1);
  }

  this.showUserName = false;
  this.loggedIn = false; // not logged in
  this.loggedOut = true; // user is logged out
  this.uploadShow = false; //don't show the upload button
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
    .otherwise({
      redirectTo: '/home'
    });
}]);

visualServApp.controller('navbarCtrl', ['$scope', '$http', '$cookies', '$location', '$rootScope', 'navBarService', function ($scope, $http, $cookies, $location, $rootScope, navBarService) {

  if ($cookies.get('token')) {
    navBarService.uploadShow = true;
    navBarService.loggedIn = true;
    navBarService.loggedOut = false;
    navBarService.showUserName = true;
    navBarService.setUserName($cookies.get('name'));
  }

  $scope.logout = function () {
    $cookies.remove('token');
    navBarService.uploadShow = false;
    navBarService.loggedIn = false;
    navBarService.loggedOut = true;
    navBarService.showUserName = false;
  }
  $scope.$watch(function () {
    return navBarService.loggedIn;
  }, function (newValue) {
    $scope.loggedIn = newValue;
  }, true);

  $scope.$watch(function () {
    return navBarService.loggedOut;
  }, function (newValue) {
    $scope.loggedOut = newValue;
  }, true);

  $scope.$watch(function () {
    return navBarService.uploadShow;
  }, function (newValue) {
    $scope.uploadShow = newValue;
  }, true);

  $scope.$watch(function () {
    return navBarService.showUserName;
  }, function (newValue) {
    $scope.welcomeMsgShow = newValue;
  }, true);

  $scope.$watch(function () {
    return navBarService.userName;
  }, function (newValue) {
    $scope.welcomeMsg = "Welcome, " + newValue;
  }, true);
}]);

