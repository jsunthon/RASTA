/**
 * Created by bhernand on 6/30/16.
 */

var addEmail = angular.module('addEmail', [ngCookies]);

addEmail.controller('emailCtrl',['$scope', '$http', '$cookies', '$location', '$timeout', function ($scope, $http, $cookies, $location, $timeout) {
  $scope.hi = "hi";
  console.log($scope.hi);
}