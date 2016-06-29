'use strict';
var app;

app = angular.module('eracordUiApp.directives');

app.directive('teacherSubjects', function(Restangular) {
  return {
    restrict: 'AE',
    transclude: true,
    scope:  true,
    templateUrl: 'views/teachers/teacher_subjects.html',
    controller: ['$scope', 'Restangular', 'Flash', '$location', function(scope, Restangular, Flash, $location){
      scope.requestLoading = false;
      scope.subjects = [];
      var profileLoaded = false;
      
      scope.loadProfile = function(){
	scope.profileRequestLoading = true;
	Restangular.all("").customGET("/organisation_profile").then(function(data){
	  if(data.success) {
	    scope.organisation = data.organisation;
	    scope.is_root = data.is_root;
	  } else {
	    $location.path('/admin_desk').replace();
	  }
	  scope.profileRequestLoading = false;
	});
      };

      //scope.loadProfile();
    }]
  };
});
//end organisation profile

