'use strict';
var app;

app = angular.module('eracordUiApp.directives');

app.directive('meetingsStudent', function(Restangular) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      meetingId: '@',
    },
    templateUrl: 'views/meetings/students.html',
    controller: ['$scope', 'Restangular', 'Flash', '$location', '$window', '$routeParams', '$route', 'Upload', '$cookieStore', function(scope, Restangular, Flash, $location, $window, $routeParams, $route, Upload, $cookieStore){

      scope.studentLoading = true;
      //scope.studentLoaded = false;
      var meeting = Restangular.one("parents_meetings", scope.meetingId);
      scope.pagination = {
        current: $routeParams.page || 1
      };

      scope.filter = {};
      
      scope.pageChanged = function(newPage) {
        loadStudents(newPage);
      };

      scope.resetFilter = function() {
	scope.filter = {};
	if(scope.pagination.current == 1) {
	  loadStudents(1);
	} else {
	  scope.pagination.current = 1;
	}
      };

      scope.filterData = function() {
	if(scope.pagination.current == 1) {
	  loadStudents(1);
	} else {
	  scope.pagination.current = 1;
	}
      }

      var loadStudents = function(page) {
	meeting.customGET("get_meeting_students", {page: page, filter: scope.filter}).then(function(data) {
	  if(data.success) {
	    scope.students = data.students;
	    scope.totalCount = data.total_count;
	  } else {
	    
	  }
	  scope.studentLoading = false;
	});
      }

      loadStudents(1);
    }]
  };
});

app.directive('selectMeetingsStudents', function(Restangular) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      jkciClassId: "@",
      studentList: "="
    },
    templateUrl: 'views/meetings/select_students.html',
    controller: ['$scope', 'Restangular', 'Flash', '$location', '$window', '$routeParams', '$route', 'Upload', '$cookieStore', '$timeout', function(scope, Restangular, Flash, $location, $window, $routeParams, $route, Upload, $cookieStore, $timeout){
      
      //scope.requestLoading = true;
      //scope.studentLoaded = false;
      var parents_meetings = Restangular.all("parents_meetings");
      
      var getStudents = function(){
	scope.studentList = [];
	scope.requestLoading = true;
	parents_meetings.customGET("get_class_students",{class_id: scope.jkciClassId}).then(function(data){
	  scope.students = data.students;  
	  scope.requestLoading = false;
	});
      };

      scope.$watch('jkciClassId', function(){
	if(scope.jkciClassId) {
	  getStudents();
	}
      });

      scope.checkAllStudent = function() {
        _.each(scope.students, function(student){
	  $timeout(function(){student.checked = true;}, 5); 
        });
      };

      scope.uncheckAllStudent = function() {
        _.each(scope.students, function(student){
	  $timeout(function(){student.checked = false;}, 5); 
        });
      };

    }]
  };
});

