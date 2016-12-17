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
    controller: ['$scope', 'Restangular', 'Flash', '$location', '$window', '$uibModal', function(scope, Restangular, Flash, $location, $window, $uibModal){
      var classDivisionLoaded = false;
      var jkci_classes = Restangular.one("jkci_classes", scope.classId);
      scope.requestLoading = true;
      
      var loadDivisions = function() {
	scope.requestLoading = true;
	jkci_classes.customGET("sub_classes").then(function(data) {
	  if(data.success) {
	    scope.divisions = data.sub_classes;
	  }else {
	  }
	  scope.requestLoading = false;
	});
      }

      scope.newDivisionModel = function(size) {
	var modalInstance = $uibModal.open({
	  animation: true,
	  templateUrl: 'views/divisions/new_divisions.html',
	  controller: 'CreateDivisionCtrl',
	  size: size,
	  resolve: {
	    class_id: function(){
	      return scope.classId;
	    }
	    
	  }
	});
	modalInstance.result.then(null, function () {
	  loadDivisions();
	  //$scope.reloadStudent = $scope.reloadStudent + 1;
	});
      };
      
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
      divisionId: '@',
      reloadStudent: '='
    },
    templateUrl: 'views/students/index.html',
    controller: ['$scope', 'Restangular', 'Flash', '$location', '$window', '$routeParams', function(scope, Restangular, Flash, $location, $window, $routeParams){
      var jkci_classes = Restangular.one("jkci_classes", scope.classId);
      scope.showOptions = true;
      scope.isRemove = true;
      scope.filter = {};
      scope.pagination = {
        current: $routeParams.page || 1
      };
      
      var getResultsPage = function(pageNumber) {
	scope.requestLoading = true;
	scope.students = [];
	jkci_classes.one("sub_classes", scope.divisionId).customGET("students", {page: pageNumber, search: scope.filter}).then(function(data){
	  if(data.success) {
	    scope.students = data.students;
	    scope.totalStudents = data.count;
	  } else {
	  }
	  scope.requestLoading = false;
	  
	});
      };

      scope.resetFilter = function() {
	scope.filter = {};
	if(scope.pagination.current == 1) {
	  getResultsPage(1);
	} else {
	  scope.pagination.current = 1;
	}
      };

      scope.filterData = function() {
	if(scope.pagination.current == 1) {
	  getResultsPage(1);
	} else {
	  scope.pagination.current = 1;
	}
      };

      scope.openInfo = function(row) {
	if(row.expanded === true) {
	  _.map(scope.students, function(student){ student.expanded = false;})
	}else {
	  _.map(scope.students, function(student){ student.expanded = false;})
	  row.expanded = true;
	}
      };
      
      scope.pagination = {
        current: $routeParams.page || 1
      };
      
      scope.pageChanged = function(newPage) {
        getResultsPage(newPage);
      };

      scope.removeStudent = function(student) {
	if($window.confirm("Do you really want to remove '"+student.name+"' from this division?")){
	  jkci_classes.one("sub_classes", scope.divisionId).one('remove_student', student.id).remove().then(function(data){
	    if(data.success) {
	      scope.students = _.reject(scope.students, function(obj){return obj.id == student.id});
	    }else {
	    }
	  });
	}
      }
      
      scope.$watch("reloadStudent", function(){
	getResultsPage(1);
      });

    }]
  }
});
