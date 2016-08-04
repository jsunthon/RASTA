var tickets = angular.module('tickets', ['ngMaterial']);

tickets.service('ticketsService', function ($http, $location) {
  this.getTickets = function () {
    return $http.get('/api/getTickets').then(function (response) {
      return response.data;
    });
  }

  this.resolveTicket = function (ticketId) {
    return $http.get('/api/closeTicket/' + ticketId).then(function (response) {
      return response.status;
    });
  }
});

tickets.controller('ticketsCtrl', function ($scope, ticketsService, validateUserService, $timeout) {

  validateUserService.validateUser().then(function (response) {
    $scope.validUser = response;
  });

  var TicketsAvail = function (services) {
    /**
     * @type {!Object<?Array>} Data pages, keyed by page number (0-index).
     */
    this.loadedPages = {};
    /** @type {number} Total number of items. */
    this.numItems = 0;
    /** @const {number} Number of items to fetch per request. */
    this.PAGE_SIZE = 20;
    this.services = services;
    this.fetchNumItems_();
  };
  // Required.
  TicketsAvail.prototype.getItemAtIndex = function (index) {
    var pageNumber = Math.floor(index / this.PAGE_SIZE);
    var page = this.loadedPages[pageNumber];
    if (page) {
      return page[index % this.PAGE_SIZE];
    } else if (page !== null) {
      this.fetchPage_(pageNumber);
    }
  };
  // Required.
  TicketsAvail.prototype.getLength = function () {
    return this.numItems;
  };

  TicketsAvail.prototype.fetchPage_ = function (pageNumber) {
    // Set the page to null so we know it is already being fetched.
    this.loadedPages[pageNumber] = null;
    $timeout(angular.noop, 300).then(angular.bind(this, function() {
      this.loadedPages[pageNumber] = [];
      var pageOffset = pageNumber * this.PAGE_SIZE;
      for (var i = pageOffset; i < pageOffset + this.PAGE_SIZE; i++) {
        this.loadedPages[pageNumber].push(this.services[i]);
      }
    }));
  };

  TicketsAvail.prototype.fetchNumItems_ = function () {
    this.numItems = this.services.length;
  };

  $scope.ticketsLoading = true;
  ticketsService.getTickets().then(function (response) {
    $scope.ticketsLoading = false;
    if (response.length !== 0) {
      $scope.areTickets = true;
      $scope.tickets = response;
      $scope.tickets = $scope.tickets.map(function (ticket) {
        ticket.issues = new TicketsAvail(ticket.issues);
        return ticket;
      });
    } else {
      $scope.areTickets = false;
    }
  });

  $scope.resolveTicket = function (ticketId) {
    $scope.ticketsLoading = true;
    ticketsService.resolveTicket(ticketId).then(function (response) {
      ticketsService.getTickets().then(function (response) {
        $scope.ticketsLoading = false;
        if (response.length !== 0) {
          $scope.areTickets = true;
          $scope.tickets = response;
          $scope.tickets = $scope.tickets.map(function (ticket) {
            ticket.issues = new TicketsAvail(ticket.issues);
            return ticket;
          });
        } else {
          $scope.areTickets = false;
        }
      });
    });
  }

  $scope.animateElementIn = function ($el) {
    $el.removeClass('not-visible');
    $el.addClass('animated fadeIn');
  };

  $scope.animateElementOut = function ($el) {
    $el.addClass('not-visible');
    $el.removeClass('animated fadeIn');
  };
});