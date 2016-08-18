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

  this.resolveAsyncTicket = function (ticketId) {
    return $http.get('/api/closeAsyncTicket/' + ticketId).then(function (response) {
      return response.status;
    });
  }

  this.validateTicketIssues = function(ticket) {
    ticket.issues = ticket.issues.map(function (issue) {
      if (!issue.service_id) {
        issue.service_id = {
          url: 'Deleted',
          response_type: 'Deleted'
        }
      }
      return issue;
    });
    return ticket.issues;
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
  $scope.asyncTicketsLoading = true;
  ticketsService.getTickets().then(function (response) {
    var ticketsRsp = response.tickets;
    $scope.ticketsLoading = false;
    if (ticketsRsp.length !== 0) {
      $scope.areTickets = true;
      $scope.tickets = ticketsRsp;
      $scope.tickets = $scope.tickets.map(function (ticket) {
        ticket.issues = ticketsService.validateTicketIssues(ticket);
        ticket.issues = new TicketsAvail(ticket.issues);
        return ticket;
      });
    } else {
      $scope.areTickets = false;
    }

    var asyncTicketsRsp = response.asyncTickets;
    $scope.asyncTicketsLoading = false;
    if (asyncTicketsRsp.length !== 0) {
      console.log(JSON.stringify(asyncTicketsRsp));
      $scope.areAsyncTickets = true;
      $scope.asyncTickets = asyncTicketsRsp;
      $scope.asyncTickets = $scope.asyncTickets.map(function (ticket) {
        ticket.issues = new TicketsAvail(ticket.issues);
        return ticket;
      });
    } else {
      $scope.areAsyncTickets = false;
    }
  });

  $scope.resolveTicket = function (ticketId) {
    $scope.ticketsLoading = true;
    ticketsService.resolveTicket(ticketId).then(function (response) {
      if (response === 200) {
        $scope.ticketResolved = true;
        $scope.ticketIdResolved = ticketId;
      }
      ticketsService.getTickets().then(function (response) {
        var ticketsRsp = response.tickets;
        $scope.ticketsLoading = false;
        if (ticketsRsp.length !== 0) {
          $scope.areTickets = true;
          $scope.tickets = ticketsRsp;
          $scope.tickets = $scope.tickets.map(function (ticket) {
            ticket.issues = ticketsService.validateTicketIssues(ticket);
            ticket.issues = new TicketsAvail(ticket.issues);
            return ticket;
          });
        } else {
          $scope.areTickets = false;
        }
      });
    });
  }

  $scope.resolveAsyncTicket = function (ticketId) {
    console.log(ticketId);
    $scope.asyncTicketsLoading = true;
    ticketsService.resolveAsyncTicket(ticketId).then(function (response) {
      if (response === 200) {
        $scope.asyncTicketResolved = true;
        $scope.asyncTicketIdResolved = ticketId;
      }
      ticketsService.getTickets().then(function (response) {
        var asyncTicketsRsp = response.asyncTickets;
        $scope.asyncTicketsLoading = false;
        if (asyncTicketsRsp.length !== 0) {
          console.log(JSON.stringify(asyncTicketsRsp));
          $scope.areAsyncTickets = true;
          $scope.asyncTickets = asyncTicketsRsp;
          $scope.asyncTickets = $scope.asyncTickets.map(function (ticket) {
            ticket.issues = new TicketsAvail(ticket.issues);
            return ticket;
          });
        } else {
          $scope.areAsyncTickets = false;
        }
      });
    });
  }

  $scope.loadServiceResult = function(serviceResult) {
    $scope.serviceResult = serviceResult;
    if ($scope.serviceResult.receivedResponse) {
      $scope.serviceResult.receivedResponse = JSON.stringify($scope.serviceResult.receivedResponse, null, 2);
    }
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