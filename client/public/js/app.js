'use strict';
var visualServApp = angular.module('visualServApp', ['ngRoute',
  'charts', 'upload', 'signup', 'login']);
visualServApp.config(['$routeProvider', function ($routeProvider) {
  // console.log("....sadsad");
  // $routeProvider
  //   .when('/home', {
  //     templateUrl: '../../views/partials/charts.html',
  //     controller: 'chartCtrl'
  //   })
  //   .when('/upload', {
  //     templateUrl: '../../views/partials/upload.html',
  //     controller: 'uploadCtrl'
  //   })
  //   .when('/signup', {
  //     templateUrl: '../../views/partials/signup.html',
  //     controller: 'signupCtrl'
  //   })
  //   .when('/login', {
  //     templateUrl: '../../views/partials/login.html',
  //     controller: 'loginCtrl'
  //   })
  //   .otherwise({
  //     redirectTo: '/home'
  //   });
}]);
