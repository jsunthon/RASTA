'use strict';
var visualServApp = angular.module('visualServApp', ['ngRoute',
  'charts', 'upload', 'login', 'addUser']);

//register the navBarService
visualServApp.service('navBarService', function () {
  this.userName = function(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
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
      .when('/wiki', {
        templateUrl: '../views/partials/wiki.html',
        controller: ''
      })
    .when('/upload', {
      templateUrl: '../views/partials/upload.html',
      controller: 'uploadCtrl'
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

visualServApp.controller('navbarCtrl', ['$scope', '$http', '$cookies', '$location', '$rootScope', 'navBarService', function($scope, $http, $cookies, $location, $rootScope, navBarService) {

  if ($cookies.get('token')) {
    navBarService.uploadShow = true;
    navBarService.loggedIn = true;
    navBarService.loggedOut = false;
    navBarService.showUserName = true;
  }

  $scope.logout = function() {
    $cookies.remove('token');
    navBarService.uploadShow = false;
    navBarService.loggedIn = false;
    navBarService.loggedOut = true;
    navBarService.showUserName = false;
  }
  $scope.$watch(function(){return navBarService.loggedIn;}, function (newValue) {
    console.log("isLoggedIn changed to " + newValue);
    $scope.loggedIn = newValue;
  }, true);

  $scope.$watch(function(){return navBarService.loggedOut;}, function (newValue) {
    console.log("isLoggedOut changed to " + newValue);
    $scope.loggedOut = newValue;
  }, true);

  $scope.$watch(function(){return navBarService.uploadShow;}, function (newValue) {
    console.log("isUploadShow changed to " + newValue);
    $scope.uploadShow = newValue;
  }, true);

  $scope.$watch(function(){return navBarService.showUserName;}, function (newValue) {
    $scope.welcomeMsgShow = newValue;
  }, true);
}]);

