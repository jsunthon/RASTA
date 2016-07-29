var editServices = angular.module('editServices', ['infinite-scroll', 'ngMaterial']);
angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 1000);

editServices.service('editService', function ($http) {

  this.updateService = function (services) {
    services = this.getSelectedServices(services);
    return $http.post('/api/update_service', services,
      {headers: {'Content-Type': 'application/json'}}).then(function (response) {
      return response.data;
    });
  }

  this.getSelectedServices = function(services) {
    if (services !== undefined) {
      var selectedServices = services.filter(function (service) {
        return service.alreadySelected === true;
      });
      return selectedServices;
    }
  }
});

editServices.factory('WebServices', function($http) {
  var WebServices = function() {
    this.items = [];
    this.busy = false;
    this.skip = 0;
  };

  WebServices.prototype.nextPage = function() {
    if (this.busy) return;
    this.busy = true;

    $http.get('/api/getAllServices/' + this.skip).then(function (response) {
      var services = response.data;
      services.forEach(function (service) {
        service.delete = false;
        service.alreadySelected = false;
        this.items.push(service);
      }.bind(this));
      this.skip += 10;
      this.busy = false;
    }.bind(this));
  };

  return WebServices;
});

editServices.service('sbServ', function($http) {
  var servicesArr = [];

  this.getServices = function () {
    $http.get('/api/getAllServices').then(function (response) {
      servicesArr = response.data;
    });
  }

  this.querySearch = function (query) {
    return query ? servicesArr.filter(createFilterFor(query)) : servicesArr;
  }

  function createFilterFor(query) {
    var lowercaseQuery = angular.lowercase(query);
    return function filterFn(service) {
      if (service) {
        return (service.name.indexOf(lowercaseQuery) === 0 || service.url.indexOf(lowercaseQuery) === 0);
      }
    };
  }
});

editServices.controller('editServicesCtrl', function ($scope, $timeout, editService, validateUserService, WebServices, sbServ) {

  validateUserService.validateUser().then(function (response) {
    $scope.validUser = response;
  });

  $scope.$on('$routeChangeSuccess', function () {
    sbServ.getServices();
  });

  $scope.WebServices = new WebServices();

  $scope.selected = function (serviceSelected) {
    if (!serviceSelected.alreadySelected) {
      var service = $scope.WebServices.items.find(function (service) {
        return service._id === serviceSelected._id;
      });
      service.alreadySelected = true;
    }
  }

  $scope.saveChanges = function () {
    var selectedServices = editService.getSelectedServices($scope.WebServices.items);
    var serviceTable = document.getElementById("editServicesTable");
    var statusMsg = document.getElementById("statusMsg");

    if (selectedServices.length > 0) {
      serviceTable.style.display = "none";
      $scope.updatingServices = true;
      $scope.showUpdateMsg = false;
      editService.updateService($scope.WebServices.items).then(function (response) {
        $scope.WebServices.items = response;
        $scope.updatingServices = false;
        statusMsg.className = "text-success";
        $scope.statusMsg = "Successfully updated service(s).";
        $scope.showUpdateMsg = true;
        serviceTable.style.display = "block";
      });
    } else {
      $scope.showUpdateMsg = true;
      statusMsg.className = "text-danger";
      $scope.statusMsg = "Please select at least one service to update.";
    }
  }

  $scope.delete = function (service) {
    $scope.selected(service);
  }

  $scope.reqTypes = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'CONNECT', 'OPTIONS', 'TRACE'];

  $scope.querySearch = function(query) {
    return sbServ.querySearch(query);
  }
});