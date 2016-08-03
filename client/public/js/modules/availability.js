var availability = angular.module('availability', ['ui.scroll', 'ui.scroll.jqlite', 'ui.bootstrap', 'ngMaterial']);

availability.controller('availCtrl', ['$scope', 'validateUserService', 'servAvailDataService', '$location', '$timeout',
  function ($scope, validateUserService, servAvailDataService, $location, $timeout) {

    var servAvailData = servAvailDataService.getServiceAvailabilityData();

    if (servAvailData) {
      $scope.dateAvail = servAvailData[servAvailData.length - 1].test_date;

      $scope.servicesAvail = servAvailData.filter(function (result) {
        return result.test_result === 2;
      });

      $scope.servicesUnavail = servAvailData.filter(function (result) {
        return result.test_result < 2;
      });

      var ServicesAvail = function(services) {
        /**
         * @type {!Object<?Array>} Data pages, keyed by page number (0-index).
         */
        this.loadedPages = {};
        /** @type {number} Total number of items. */
        this.numItems = 0;
        /** @const {number} Number of items to fetch per request. */
        this.PAGE_SIZE = 50;
        this.services = services;
        this.fetchNumItems_();
      };
      // Required.
      ServicesAvail.prototype.getItemAtIndex = function(index) {
        var pageNumber = Math.floor(index / this.PAGE_SIZE);
        var page = this.loadedPages[pageNumber];
        if (page) {
          return page[index % this.PAGE_SIZE];
        } else if (page !== null) {
          this.fetchPage_(pageNumber);
        }
      };
      // Required.
      ServicesAvail.prototype.getLength = function() {
        return this.numItems;
      };

      ServicesAvail.prototype.fetchPage_ = function(pageNumber) {
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
      ServicesAvail.prototype.fetchNumItems_ = function() {
        this.numItems = this.services.length;
      };
      $scope.servicesAv = new  ServicesAvail($scope.servicesAvail);
      $scope.servicesUnav = new  ServicesAvail($scope.servicesUnavail);

      $scope.showResults = true;
    } else {
      $location.path("/home");
    }
  }]);