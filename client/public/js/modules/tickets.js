var tickets = angular.module('tickets', []);

tickets.service('ticketsService', function($http, $location) {
  this.getTickets = function() {
    return $http.get('/api/getTickets').then(function(response) {
      return response.data;
    });
  }

  this.getTicketData = function(ticket) {
    var issues = ticket.issues;
    var issuesObj = {issues: issues};
    return $http.post('/api/getTicketData', issuesObj, {headers: {'Content-Type': 'application/json'}}).then(function(response) {
      return response.data;
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

  $scope.getTicketData = function(ticket) {
    ticketsService.getTicketData(ticket).then(function(response) {
      $scope.ticketData = response;
    });
  };
});