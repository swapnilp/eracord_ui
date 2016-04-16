'use strict';
var app;

app = angular.module('eracordUiApp.directives');


app.directive('classDivisions', function(Restangular) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      classId: '@',
      classDivisionTab: '@',
      updateUrl: '&'
    },
    templateUrl: 'views/divisions/index.html',
    controller: ['$scope', 'Restangular', 'Flash', '$location', '$window', function(scope, Restangular, Flash, $location, $window){
      var classDivisionLoaded = false;
      var jkci_classes = Restangular.one("jkci_classes", scope.classId);
      scope.requestLoading = true;
      
      var loadDivisions = function() {
	jkci_classes.customGET("sub_classes").then(function(data) {
	  if(data.success) {
	    scope.divisions = data.sub_classes;
	  }else {
	  }
	  scope.requestLoading = false;
	});
      }
      
      scope.$watch('classDivisionTab', function(){
	if(scope.classDivisionTab === 'true') {
	  scope.updateUrl({tabName: 'divisions'});
	}
	if(scope.classDivisionTab === 'true' && classDivisionLoaded === false){
	  loadDivisions();
	  scope.classDivisionLoaded = true;
	}
      });
    }]
  }
});

app.directive('divisionStudents', function(Restangular) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      classId: '@',
      divisionId: '@'
    },
    templateUrl: 'views/students/index.html',
    controller: ['$scope', 'Restangular', 'Flash', '$location', '$window', '$routeParams', function(scope, Restangular, Flash, $location, $window, $routeParams){
      var jkci_classes = Restangular.one("jkci_classes", scope.classId);
      scope.showOptions = true;
      scope.isRemove = true;
      
      var getResultsPage = function(pageNumber) {
	jkci_classes.one("sub_classes", scope.divisionId).customGET("students", {page: pageNumber, search: scope.filterStudent}).then(function(data){
	  if(data.success) {
	    scope.students = data.students;
	    scope.totalStudents = data.count;
	  } else {
	  }
	  
	});
      };
      
      scope.pagination = {
        current: $routeParams.page || 1
      };
      
      scope.pageChanged = function(newPage) {
        getResultsPage(newPage);
      };

      scope.removeStudent = function(student) {
	if($window.confirm('Are you sure?')){
	  jkci_classes.one("sub_classes", scope.divisionId).one('remove_student', student.id).remove().then(function(data){
	    if(data.success) {
	      scope.students = _.reject(scope.students, function(obj){return obj.id == student.id});
	    }else {
	    }
	  });
	}
      }
      
      getResultsPage(1);

    }]
  }
});
