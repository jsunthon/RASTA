'use strict';
var visualServApp = angular.module('visualServApp', ['ngRoute',
  'charts', 'upload', 'login', 'addUser']).run(function($rootScope) {
  $rootScope.rootLoggedOut = true;
  $rootScope.rootLoggedIn = false;
  $rootScope.rootUploadShow = false;
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

visualServApp.controller('navbarCtrl', ['$scope', '$http', '$cookies', '$location', '$rootScope', function($scope, $http, $cookies, $location, $rootScope) {

  $scope.$watch('$rootScope.rootLoggedIn', function() {
    console.log("logged in change");
    $scope.loggedIn = $rootScope.rootLoggedIn;
  });
  $scope.$watch('$rootScope.rootLoggedOut', function() {
    console.log("logged out change");
    $scope.loggedOut = $rootScope.rootLoggedOut;
  });

  $scope.$watch('$rootScope.rootUploadShow', function() {
    console.log("upload change");
    $scope.uploadShow = $rootScope.rootUploadShow;
  });

  $scope.logout = function() {
    $cookies.remove('token');
    $location.path('#/login');
  }
}]);

