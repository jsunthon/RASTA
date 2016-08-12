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

  this.getSelectedServices = function (services) {
    if (services !== undefined) {
      var selectedServices = services.filter(function (service) {
        return service.alreadySelected === true;
      });
      return selectedServices;
    }
  }
});

editServices.factory('WebServices', function ($http) {
  var WebServices = function () {
    this.items = [];
    this.busy = false;
    this.skip = 0;
  };

  WebServices.prototype.nextPage = function () {
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

editServices.service('addServices', function ($http) {
  var servicesToAdd = [];

  this.addServiceInput = function () {
    servicesToAdd.push({name: '', function_name: '', url: '', type: '', response_type: '', time_out: ''});
    return servicesToAdd;
  }

  this.deleteServiceInput = function (selectedItem) {
    servicesToAdd.splice(servicesToAdd.indexOf(selectedItem), 1);
    return servicesToAdd;
  }

  this.getServicesToAdd = function () {
    return servicesToAdd;
  }

  this.saveAddedServices = function () {
    return $http.post('/api/addServices', servicesToAdd,
      {headers: {'Content-Type': 'application/json'}}).then(function (response) {
      if (response.data.success) {
        servicesToAdd = [];
      }
      return response.data;
    });
  }

  this.showAddTable = function () {
    return servicesToAdd.length !== 0;
  }
});

editServices.service('sbServ', function ($http) {
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
        return (service.name.toLowerCase().indexOf(lowercaseQuery) === 0 || service.url.toLowerCase().indexOf(lowercaseQuery) === 0);
      }
    };
  }

  this.updateService = function (service, $scope) {
    var statusMsg = document.getElementById("statusMsg");
    $scope.updatingServices = true;
    $scope.showUpdateMsg = false;
    return $http.post('/api/update_single_service', service,
      {headers: {'Content-Type': 'application/json'}}).then(function (response) {
      $scope.updatingServices = false;
      statusMsg.className = "text-success";
      if (service.delete) {
        $scope.statusMsg = "Successfully deleted service: " + "'" + service.name + "'";
      } else {
        $scope.statusMsg = "Successfully updated service : " + "'" + service.name + "'";
      }
      $scope.showUpdateMsg = true;
      return response.data;
    });
  }

  this.refreshBrowseData = function () {
    return $http.get('/api/getAllServices/' + 0).then(function (response) {
      var services = response.data;
      services.forEach(function (service) {
        service.delete = false;
        service.alreadySelected = false;
      });
      return services;
    });
  }
});

editServices.service('addPostBody', function () {
  this.convertReqInputBodyArr = function (reqInputBodyArr) {
    var reqInputBodyObj = {};
    reqInputBodyArr.forEach(function (reqInputBody) {
      reqInputBodyObj[reqInputBody.key] = reqInputBody.value;
    });
    return reqInputBodyObj;
  }

  this.convertReqInputObj = function (reqInputBodyObj) {
    var keys = Object.keys(reqInputBodyObj);
    var reqBodyInputs = [];
    keys.forEach(function (key) {
      console.log('Key: ' + key);
      console.log('Value: ' + reqInputBodyObj[key]);
      var reqBodyInput = {};
      reqBodyInput.key = key;
      reqBodyInput.value = reqInputBodyObj[key];
      reqBodyInputs.push(reqBodyInput);
    });
    return reqBodyInputs;
  }
});


editServices.controller('editServicesCtrl', function ($scope, $http, $timeout, editService, validateUserService, WebServices, sbServ, addServices, addPostBody) {

  validateUserService.validateUser().then(function (response) {
    $scope.validUser = response;
  });

  $scope.$on('$routeChangeSuccess', function () {
    sbServ.getServices();
  });

  $scope.servicesToAdd = addServices.getServicesToAdd();

  $scope.addServiceInput = function () {
    if (!$scope.inputAdded) {
      $scope.inputAdded = true;
    }
    $scope.servicesToAdd = addServices.addServiceInput();
  }

  $scope.deleteServiceInput = function (selectedItem) {
    $scope.servicesToAdd = addServices.deleteServiceInput(selectedItem);
    $scope.inputAdded = addServices.showAddTable();
  }

  $scope.saveAddedServices = function () {
    addServices.saveAddedServices().then(function (response) {
      if (response.success) {
        console.log('call successful');
        console.log(JSON.stringify(response.servicesAdded));
        $scope.servicesAdded = response.servicesAdded;
        $('#servicesAdded').modal('show');
      }
      $scope.servicesToAdd = addServices.getServicesToAdd();
      $scope.inputAdded = addServices.showAddTable();
      updatePostSingleEditSave();
    });
  }

  $scope.WebServices = new WebServices();

  $scope.selected = function (serviceSelected) {
    if (!serviceSelected.alreadySelected) {
      var service = $scope.WebServices.items.find(function (service) {
        return service._id === serviceSelected._id;
      });
      service.alreadySelected = true;
    }
  }

  $scope.saveSingleServ = function (serv) {
    sbServ.updateService(serv, $scope).then(function (serviceUpdated) {
      $scope.selectedItem = serviceUpdated;
      updatePostSingleEditSave();
    });
  }

  function updatePostSingleEditSave() {
    sbServ.refreshBrowseData().then(function (services) {
      $scope.WebServices.items = services;
      sbServ.getServices();
    });
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
        $scope.WebServices.items = response.tenServices;
        $scope.servicesUpdated = response.servicesUpdated;
        $('#servicesUpdated').modal('show');
        $scope.updatingServices = false;
        statusMsg.className = "text-success";
        $scope.statusMsg = "Successfully updated service(s).";
        $scope.showUpdateMsg = true;
        serviceTable.style.display = "block";
        sbServ.getServices();
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

  $scope.reqTypes = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'];

  $scope.querySearch = function (query) {
    return sbServ.querySearch(query);
  }

  $scope.reqBodyInputs = [];

  $scope.addReqBody = function (service) {
    $scope.initReqBodyInputs(service);
  }
  $scope.addReqBodyBrowsed = function (service) {
    $scope.initReqBodyInputs(service);
    $scope.selected(service);
  }

  $scope.initReqBodyInputs = function (service) {
    $scope.saveReqBodyMsg = '';
    if (service) {
      $scope.serviceToAddReqBody = service;
      if (!service.reqBody) {
        $scope.reqBodyInputs = [];
      } else {
        $scope.reqBodyInputs = addPostBody.convertReqInputObj(service.reqBody);
      }
    }
  }

  $scope.addRequestBodyInput = function () {
    var reqInput = {};
    $scope.reqBodyInputs.push(reqInput);
  }

  $scope.saveReqBody = function () {
    $scope.serviceToAddReqBody.reqBody = addPostBody.convertReqInputBodyArr($scope.reqBodyInputs);
    $scope.saveReqBodyMsg = 'Request body to save later: ' + JSON.stringify($scope.serviceToAddReqBody.reqBody);
    console.log('Arr: ' + JSON.stringify($scope.reqBodyInputs));
    console.log('ReqInputBody normalized: ' + JSON.stringify($scope.serviceToAddReqBody.reqBody));
  }

  $scope.deleteReqBodyInput = function (reqBodyInput) {
    $scope.reqBodyInputs.splice($scope.reqBodyInputs.indexOf(reqBodyInput), 1);
  }
});