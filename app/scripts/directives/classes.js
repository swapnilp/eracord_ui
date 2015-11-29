'use strict';
var app;

app = angular.module('eracordUiApp.directives');

app.directive('classStudents', function(Restangular) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      classId: '@'
    },
    templateUrl: 'views/students/index.html',
    controller: ['$scope', 'Restangular', 'Flash', '$location', '$window', function(scope, Restangular, Flash, $location, $window){
      scope.cources = [];

      var jkci_classes = Restangular.one("jkci_classes", scope.classId);
      scope.isRemove = true;
      scope.loadCources = function() {
	jkci_classes.customGET("students").then(function(data){
	  scope.students = data.students;
	});
      };

      scope.removeStudent = function(student) {
	if($window.confirm('Are you sure?')){
	  jkci_classes.one('students', student.id).remove().then(function(data){
	    if(data.success) {
	      scope.students = _.reject(scope.students, function(obj){return obj.id == student.id});
	    }else {
	    }
	  });
	}
      }

      scope.loadCources();
      
    }]
  };
});

