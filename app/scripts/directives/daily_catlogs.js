'use strict';
var app;

app = angular.module('eracordUiApp.directives');

app.directive('classDailyTeachesCatlogs', function(Restangular) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      classId: '@',
      dailyTeachesId: '@',
      isVerifyAbsenty: '=',
      isSmsSent: '=',
      enableSms: '='
      
    },
    templateUrl: 'views/daily_catlogs/class_catlogs.html',
    controller: ['$scope', 'Restangular', 'Flash', '$location', '$window', function(scope, Restangular, Flash, $location, $window){
      
      var jkci_classes = Restangular.one("jkci_classes", scope.classId);
      scope.publishEnable = true;
            
      scope.loadCatlog = function(){
	jkci_classes.one("daily_teachs", scope.dailyTeachesId).customGET("get_catlogs").then(function(data){
	  if(data.success){
	    scope.dtpCatlogs = data.class_catlogs;
	  }
	})
      };

      scope.absentStudent = function(catlog) {
	jkci_classes.one("daily_teachs", scope.dailyTeachesId).customPOST({student: catlog.id}, "add_absent_student", {})
	  .then(function(data){
	    if(data.success){
	      scope.isVerifyAbsenty = false;
	      catlog.is_present = false;
	    }
	  });
      };

      scope.removeAbsent = function(catlog) {
	jkci_classes.one("daily_teachs", scope.dailyTeachesId).customPOST({student: catlog.id}, "remove_absent_student", {})
	  .then(function(data){
	    if(data.success){
	      scope.isVerifyAbsenty = false;
	      catlog.is_present = null;
	    }
	  });
      };

      scope.publishAbsenty = function() {
	jkci_classes.one("daily_teachs", scope.dailyTeachesId).customPOST({}, "publish_absenty", {})
	  .then(function(data){
	    if(data.success) {
	      scope.isSmsSent = true;
	    }
	  });
      };
      
      scope.verifyAbsenty = function() {
	jkci_classes.one("daily_teachs", scope.dailyTeachesId).customGET("class_absent_verification").then(function(data) {
	  if(data.success) {
	    scope.isVerifyAbsenty = true;
	    scope.isSmsSent = false;
	  }else {
	  }
	});
      };
      
      scope.$watch('dailyTeachesId', function(){
	if(!isEmpty(scope.dailyTeachesId)){
	  scope.loadCatlog();
	}
      })
      
      
    }]
  }
});
