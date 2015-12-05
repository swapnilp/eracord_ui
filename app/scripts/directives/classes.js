'use strict';
var app;

app = angular.module('eracordUiApp.directives');

app.directive('classStudents', function(Restangular) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      classId: '@',
      classStudentsTab: '@'
    },
    templateUrl: 'views/students/index.html',
    controller: ['$scope', 'Restangular', 'Flash', '$location', '$window', function(scope, Restangular, Flash, $location, $window){
      scope.cources = [];

      scope.studentLoaded = false;
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
      
      scope.$watch('classStudentsTab', function(){
	if(scope.classStudentsTab === 'true' && scope.studentLoaded == false){
	  scope.loadCources();
	  scope.studentLoaded = true;
	}
      });

    }]
  };
});

app.directive('classExams', function(Restangular) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      classId: '@',
      classExamsTab: '@'
    },
    templateUrl: 'views/exams/index.html',
    controller: ['$scope', 'Restangular', 'Flash', '$location', '$window', function(scope, Restangular, Flash, $location, $window){

      scope.examsLoaded = false;
      var jkci_classes = Restangular.one("jkci_classes", scope.classId);
      scope.totalExams = 0;
      
      scope.pagination = {
        current: 1
      };
      
      var getResultsPage = function(pageNumber) {
	jkci_classes.customGET("exams" ,{page: pageNumber}).then(function(data){
	  scope.exams = data.body;
	  scope.totalExams = data.count;
	});

      };
      
      scope.pageChanged = function(newPage) {
        getResultsPage(newPage);
      };
      
      scope.isRemove = true;
      scope.loadClassExams = function() {
	
      };

      scope.$watch('classExamsTab', function(){
	if(scope.classExamsTab === 'true' && scope.examsLoaded == false){
	  getResultsPage(1);
	  scope.examsLoaded = true;
	}
      });

    }]
  };
});

app.directive('classDailyTeaches', function(Restangular) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      classId: '@',
      classDtpTab: '@'
    },
    templateUrl: 'views/daily_catlogs/index.html',
    controller: ['$scope', 'Restangular', 'Flash', '$location', '$window', function(scope, Restangular, Flash, $location, $window){
      var dailyCatlogLoaded = false;
      var jkci_classes = Restangular.one("jkci_classes", scope.classId);
      
      scope.loadDailyCatlog = function() {
	jkci_classes.customGET('daily_teachs').then(function(data){
	  if(data.success) {
	    scope.dtps = data.daily_teaching_points;
	  }else {
	  }
	});
      };

      scope.$watch('classDtpTab', function(){
	if(scope.classDtpTab === 'true' && dailyCatlogLoaded === false){
	  scope.loadDailyCatlog();
	  scope.dailyCatlogLoaded = true;
	}
      });
    }]
  }
});
