'use strict';
var visualServApp = angular.module('visualServApp', ['ngRoute',
  'charts', 'upload', 'login', 'addUser']);

//register the navBarService
visualServApp.service('navBarService', function () {
  var isLoggedIn = false; // not logged in
  var isLoggedOut = true; // user is logged out
  var isUploadShow = false; //don't show the upload button

  this.getLoggedIn = function() {
    return isLoggedIn;
  }

  this.getLoggedOut = function() {
    return isLoggedOut;
  }

  this.getUploadShow = function() {
    return isUploadShow;
  }

  this.setLoggedIn = function(loggedIn) {
    isLoggedIn = loggedIn;
  }

  this.setLoggedOut = function(loggedOut) {
    isLoggedOut = loggedOut;
  }

  this.setUploadShow = function(uploadShow) {
    isUploadShow = uploadShow;
  }
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

  // $scope.loggedIn = navBarService.getLoggedIn();
  // $scope.loggedOut = navBarService.getLoggedOut();
  // $scope.uploadShow = navBarService.getUploadShow();

  $scope.logout = function() {
    $cookies.remove('token');
    $location.path('#/login');
  }

  //watch variables
  $scope.$watch(function() {
    navBarService.getLoggedIn();
  }, function(newValue, oldValue) {
    console.log("something changed");
    $scope.loggedIn = navBarService.getLoggedIn();
  });

  $scope.$watch('navBarService.getLoggedOut', function() {
    console.log("something changed");
    $scope.loggedOut = navBarService.getLoggedOut();
  });

  $scope.$watch('navBarService.getUploadShow', function() {
    console.log("something changed");
    $scope.uploadShow = navBarService.getUploadShow();
  });
}]);

