var tickets = angular.module('tickets', []);

tickets.service('ticketsService', function($http, $location) {
  this.getTickets = function() {
    return $http.get('/api/getTickets').then(function(response) {
      return response.data;
    });
  }

  this.resolveTicket = function(ticketId) {
    return $http.get('/api/closeTicket/' + ticketId).then(function(response) {
      return response.status;
    });
  }
});

tickets.controller('ticketsCtrl', function($scope, ticketsService, validateUserService) {

  validateUserService.validateUser().then(function(response) {
    $scope.validUser = response;
  });

  $scope.ticketsLoading = true;
  ticketsService.getTickets().then(function(response) {
    $scope.ticketsLoading = false;
    if (response.length !== 0) {
      $scope.areTickets = true;
      $scope.tickets = response;
    } else {
      $scope.areTickets = false;
    }
  });

  $scope.resolveTicket = function(ticketId) {
    $scope.ticketsLoading = true;
    ticketsService.resolveTicket(ticketId).then(function(response) {
      ticketsService.getTickets().then(function(response) {
        $scope.ticketsLoading = false;
        if (response.length !== 0) {
          $scope.areTickets = true;
          $scope.tickets = response;
        } else {
          $scope.areTickets = false;
        }
      });
    });
  }
});