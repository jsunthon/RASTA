'use strict';
var visualServApp = angular.module('visualServApp', ['ngRoute',
  'charts', 'upload', 'login', 'addUser']);
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
    .when('/addUser', {
      templateUrl: '../views/partials/addUser.html',
      controller: 'addCtrl'
    })
    .otherwise({
      redirectTo: '/home'
    });
}]);

visualServApp.controller('navbarCtrl', ['$scope', '$http', '$cookies', '$location', function($scope, $http, $cookies, $location) {
  $scope.logout = function() {
    $cookies.remove('token');
    document.getElementById('loginStatus').innerHTML = "Login";
    document.getElementById('logout').innerHTML = "";
    document.getElementById("uploadButton").style.display = "none";
    $location.path('#/login');
  }



}]);

