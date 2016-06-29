'use strict';
var visualServApp = angular.module('visualServApp', ['ngRoute',
  'charts', 'upload', 'login', 'addUser']);

//register the navBarService
visualServApp.service('navBarService', function () {
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

  $scope.loggedIn = navBarService.loggedIn;
  $scope.loggedOut = navBarService.loggedOut;
  $scope.uploadShow = navBarService.uploadShow;

  $scope.logout = function() {
    $cookies.remove('token');
    $location.path('#/login');
  }
}]);

