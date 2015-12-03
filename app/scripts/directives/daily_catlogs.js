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
      isVerifyAbsenty: '='
    },
    templateUrl: 'views/daily_catlogs/class_catlogs.html',
    controller: ['$scope', 'Restangular', 'Flash', '$location', '$window', function(scope, Restangular, Flash, $location, $window){
      
      var jkci_classes = Restangular.one("jkci_classes", scope.classId);
      scope.publishEnable = true;
      scope.absentyChangeFlag = false;
            
      scope.loadCatlog = function(){
	jkci_classes.one("daily_teachs", scope.dailyTeachesId).customGET("get_catlogs").then(function(data){
	  if(data.success){
	    scope.dtpCatlogs = data.class_catlogs;
	  }
	})
      };

      scope.absentStudent = function(catlog) {
	catlog.is_present = false;
	scope.absentyChangeFlag = true;
      };

      scope.removeAbsent = function(catlog) {
	catlog.is_present = null;
	scope.absentyChangeFlag = true;
      };

      scope.saveAbsenty = function() {
	var absentStudents = _.pluck(_.where(scope.dtpCatlogs, {is_present: false}), 'student_id');
	absentStudents.push(0);
	jkci_classes.one("daily_teachs", scope.dailyTeachesId).customPOST({students: absentStudents}, "fill_catlog", {})
	  .then(function(data){
	    if(data.success){
	      scope.absentyChangeFlag = false;
	      scope.isVerifyAbsenty = false;
	    }
	  });
      };

      scope.verifyAbsenty = function() {
	jkci_classes.one("daily_teachs", scope.dailyTeachesId).customGET("class_absent_verification").then(function(data) {
	  if(data.success) {
	    scope.isVerifyAbsenty = true;
	  }else {
	  }
	});
      }
      
      scope.$watch('dailyTeachesId', function(){
	if(!isEmpty(scope.dailyTeachesId)){
	  scope.loadCatlog();
	}
      })
      
      
    }]
  }
});
