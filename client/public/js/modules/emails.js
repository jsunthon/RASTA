/**
 * Created by bhernand on 6/30/16.
 */

var addEmail = angular.module('addEmail', ['ngCookies']);

addEmail.controller('emailCtrl', ['$scope', '$http', '$cookies', '$location', '$timeout', function ($scope, $http, $cookies, $location, $timeout) {
  var baseUrl = "/api/addEmail";

  $http.get('/api/validateUser').then(function(response) {
    if (response.data.success) {
      $scope.validUser = true;
    }
  }, function(error) {
    $location.path('/unauth');
  });

  $scope.addEmail = function () {
    $http.post(baseUrl + "/" + $scope.email)
      .success(function (response) {
        if (response.success) {
          $location.search('key', null);
          var addedEmail = 1;
          $location.path('/login/' + addedEmail);
        } else {
          console.log("Failed to add");
        }
      });
  };
}]);