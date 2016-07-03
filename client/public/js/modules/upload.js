var upload = angular.module('upload', []);

upload.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

upload.controller('uploadCtrl', ['$scope', '$http', '$timeout', '$location', function ($scope, $http, $timeout, $location) {
    $http.get('/api/validateUser').then(function(response) {
        if (response.data.success) {
            $scope.validUser = true;
        }
    }, function(error) {
        $location.path('/unauth');
    });
    $scope.uploadFile = function () {
        if ($scope.jsonUploaded) {
            $scope.jsonUploaded = false;
        }
        var file = $scope.myFile;
        $scope.uploadAttempt = true;
        $scope.statusStyle = {
            "font-style": "italic",
            "font-weight": "bold"
        };
        if (file) {
            var uploadUrl = "/api/post_api_list";
            uploadFileToUrl(file, uploadUrl);
        } else {
            $scope.statusColor = "text-danger";
            $scope.uploadStatus = "No JSON file was selected.";
        }
        $timeout(function () {
            $scope.uploadAttempt = false;
        }, 3000);
    };

    var uploadFileToUrl = function (file, uploadUrl) {
        $http.post(uploadUrl, file, {headers: {'Content-Type': 'application/json'}})
            .success(function (res) {
                $scope.jsonRsp = JSON.stringify(res, null, 2);
                $scope.jsonUploaded = true;
                $scope.statusColor = "text-success";
                $scope.uploadStatus = "Upload successfully processed.";
            })
            .error(function () {
                $scope.statusColor = "text-danger";
                $scope.uploadStatus = "Error in processing upload.";
            });
    }
}]);