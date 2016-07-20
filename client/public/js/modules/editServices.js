var editServices = angular.module('editServices', ['angular-scroll-animate']);

editServices.service('editService', function ($http) {

  this.updateService = function (services) {
    services = this.getSelectedServices(services);
    return $http.post('/api/update_service', services,
      {headers: {'Content-Type': 'application/json'}}).then(function (response) {
      return response.data;
    });
  }

  this.getSelectedServices = function(services) {
    var selectedServices = services.filter(function (service) {
      return service.alreadySelected === true;
    });
    return selectedServices;
  }

  this.getAllServices = function () {
    return $http.get('/api/getAllServices').then(function (response) {
      var services = response.data;
      services.forEach(function (service) {
        service.delete = false;
        service.alreadySelected = false;
      });
      return services;
    })
  }
});

editServices.controller('editServicesCtrl', function ($scope, $timeout, editService, validateUserService) {

  validateUserService.validateUser().then(function (response) {
    $scope.validUser = response;
  });

  editService.getAllServices().then(function (services) {
    $scope.services = services;
  });

  $scope.selected = function (serviceSelected) {
    if (!serviceSelected.alreadySelected) {
      var service = $scope.services.find(function (service) {
        return service._id === serviceSelected._id;
      });
      service.alreadySelected = true;
    }
  }

  $scope.saveChanges = function () {
    var selectedServices = editService.getSelectedServices($scope.services);
    var serviceTable = document.getElementById("editServicesTable");
    var statusMsg = document.getElementById("statusMsg");

    if (selectedServices.length > 0) {
      serviceTable.style.display = "none";
      $scope.updatingServices = true;
      $scope.showUpdateMsg = false;
      editService.updateService($scope.services).then(function (response) {
        $scope.services = response;
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

  $scope.animation = {};
  $scope.animation.current = 'fadeIn';
  $scope.animation.previous = $scope.animation.current;

  $scope.changeAnimation = function() {

    var elements = document.getElementsByClassName('car-container');
    var $elements = angular.element(elements);

    $elements.removeClass('animated ' + $scope.animation.previous);
    $elements.addClass('not-visible');

    $scope.animation.previous = $scope.animation.current;
    $document[0].dispatchEvent(new CustomEvent('scroll'));
  };

  $scope.animateElementIn = function($el) {
    var tdChildren = $el.children();
    var serviceName = tdChildren[1];
    var functionName = tdChildren[2];
    var requestType = tdChildren[4];
    var responseType = tdChildren[5];
    $el.removeClass('not-visible');
  };

  $scope.animateElementOut = function($el) {
    var tdChildren = $el.children();
    var serviceName = tdChildren[1];
    var functionName = tdChildren[2];
    var requestType = tdChildren[4];
    var responseType = tdChildren[5];
    $el.addClass('not-visible');
  };
});