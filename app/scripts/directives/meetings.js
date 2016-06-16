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

      scope.requestLoading = true;
      scope.studentLoaded = false;
      var jkci_classes = Restangular.one("parents_meetings", scope.meetingId);

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
    controller: ['$scope', 'Restangular', 'Flash', '$location', '$window', '$routeParams', '$route', 'Upload', '$cookieStore', function(scope, Restangular, Flash, $location, $window, $routeParams, $route, Upload, $cookieStore){
      
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
          student.checked = true;
        });
        scope.studentList = _.pluck(scope.students, 'id');
      };

      scope.uncheckAllStudent = function() {
        _.each(scope.students, function(student){
          student.checked = false;
        });
	scope.studentList = [];
      };

    }]
  };
});

