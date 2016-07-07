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
    $scope.tickets = response;
  });

  $scope.resolveTicket = function(ticketId) {
    ticketsService.resolveTicket(ticketId).then(function(response) {
      ticketsService.getTickets().then(function(response) {
        $scope.ticketsLoading = false;
        $scope.tickets = response;
      });
    });
  }
});