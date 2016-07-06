/**
 * Created by bhernand on 6/30/16.
 */

var addEmail = angular.module('addEmail', ['ngCookies']);

addEmail.service('emailService', function ($http, $location) {
  this.getEmails = function () {
    return $http.get('/api/emails').then(function (response) {
      return response.data;
    });
  }

  this.addEmail = function (email) {
    return $http.post('/api/addEmail' + '/' + email).then(function (response) {
      if (response.data.success) {
        $location.search('key', null);
      }
      return response.data;
    });
  }

  this.removeEmail = function (email) {
    return $http.post('/api/removeEmail' + '/' + email).then(function (response) {
      return response.data;
    });
  }

  this.validateUser = function() {
    return $http.get('/api/validateUser').then(function(response) {
      if (response.data.success) {
       return true;
      }
    }, function(error) {
      $location.path('/unauth');
      return false;
    });
  }
});

addEmail.controller('emailCtrl', ['$scope', '$cookies', '$location', 'emailService', function ($scope, $cookies, $location, emailService) {

  emailService.getEmails().then(function (response) {
    $scope.emails = response.emails;
  });

  emailService.validateUser().then(function(response) {
    if (response) {
      $scope.validUser = true;
    }
  });

  $scope.addEmail = function () {
    emailService.addEmail($scope.email).then(function (response) {
      emailService.getEmails().then(function (response) {
        $scope.emails = response.emails;
      });
    });
  }

  $scope.removeEmail = function (email) {
    emailService.removeEmail(email).then(function (response) {
      emailService.getEmails().then(function (response) {
        $scope.emails = response.emails;
      });
    });
  }
}]);