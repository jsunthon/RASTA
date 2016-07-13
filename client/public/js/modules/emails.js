/**
 * Created by bhernand on 6/30/16.
 */

var addEmail = angular.module('addEmail', []);

addEmail.service('emailService', function ($http, $location, $cookies) {
  this.getEmails = function () {
    return $http.get('/api/emails').then(function (response) {
      return response.data;
    });
  }

  this.addEmail = function (email) {
    return $http.post('/api/addEmail' + '/' + email + '/' + $cookies.get('name')).then(function (response) {
      if (response.data.success) {
        $location.search('key', null);
        document.getElementById("addEmailForm").reset();
      }
      return response.data;
    });
  }

  this.removeEmail = function (email) {
    return $http.post('/api/removeEmail' + '/' + email).then(function (response) {
      return response.data;
    });
  }
});

addEmail.controller('emailCtrl', ['$scope', 'emailService', 'validateUserService', '$location', '$timeout', function ($scope, emailService, validateUserService, $location, $timeout) {

  validateUserService.validateUser().then(function (response) {
    $scope.validUser = response;
  });

  emailService.getEmails().then(function (response) {
    $scope.emails = response;
  });

  $scope.addEmail = function () {
    emailService.addEmail($scope.email).then(function (response) {
      if (!response.success) {
        document.getElementById("addEmailContainer").className = "animated fadeIn ng-hide text-danger";
      } else {
        document.getElementById("addEmailContainer").className = "animated fadeIn ng-hide text-success";
      }
      $scope.addEmailAttempt = true;
      $scope.addedStatus = response.msg;
      $timeout(function () {
        $scope.addEmailAttempt = false;
      }, 5000);
      emailService.getEmails().then(function (response) {
        $scope.emails = response;
      });
    });
  }

  $scope.removeEmail = function (email) {
    emailService.removeEmail(email).then(function (response) {
      emailService.getEmails().then(function (response) {
        $scope.emails = response;
      });
    });
  }

  $scope.backToAcc = function () {
    $location.path('/login');
  }
}]);