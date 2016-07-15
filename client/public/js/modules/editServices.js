var editServices = angular.module('editServices', []);

editServices.service('editService', function ($http) {

  this.updateService = function (services) {
    services = services.filter(function (service) {
      return service.alreadySelected === true;
    });
    return $http.post('/api/update_service', services,
      {headers: {'Content-Type': 'application/json'}}).then(function (response) {
      return response.data;
    });
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
    editService.updateService($scope.services).then(function (response) {
      console.log("Response received from update services");
    });
  }

  $scope.delete = function (service) {
    $scope.selected(service);
  }
});