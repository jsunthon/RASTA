var techManual = angular.module('techManual', []);

techManual.controller('manualCtrl', function ($scope) {

  $("button").click(function () {
    //console.log(this.id);
    $(this).addClass('active').siblings().removeClass('active');

  });
});