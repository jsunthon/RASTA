/**
 * Created by bhernand on 7/28/16.
 */
var userGuide = angular.module('userGuide', []);

userGuide.controller('guideCtrl', function ($scope) {
  
  $("button").click(function () {
    //console.log(this.id);
    $(this).addClass('active').siblings().removeClass('active');

    if(this.id === "GS"){
      //alert("GS");
    }else if(this.id === "CWS"){
      //alert("CWS");
    }else if(this.id === "TFS"){
      //alert("TFS");
    }else{
      //alert("OT");
    }


  });
});