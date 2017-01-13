'use strict';
var app;

app = angular.module('eracordUiApp.directives');


app.directive('teacherDailyTeaches', function(Restangular) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      teacherId: '@',
      teacherDtpTab: '@'
    },
    templateUrl: 'views/daily_catlogs/index.html',
    controller: ['$scope', 'Restangular', 'Flash', '$location', '$window', '$routeParams', '$route', function(scope, Restangular, Flash, $location, $window, $routeParams, $route){

      var dailyCatlogLoaded = false;
      var  teacher = Restangular.one("teachers", scope.teacherId);
      scope.totalDtps = 0;
      scope.pagination = {
        current: $routeParams.page || 1
      };
      scope.requestLoading = true;
      scope.subjects = [];
      scope.filterDtp = {};
      scope.filterDtp.dateRange = {};
      
      var getFilterSubjects = function() {
	teacher.customGET("get_subjects").then(function(data) {
	  if(data.success) {
	    scope.subjects = data.subjects;
	  }
	});
      };
      
      var getDailyResultsPage = function(pageNumber) {
	scope.requestLoading = true;
	teacher.customGET('daily_teachs', {filter: scope.filterDtp, page: pageNumber}).then(function(data){
	  if(data.success) {
	    scope.dtps = data.daily_teaching_points;
	    scope.totalDtps = data.count;
	    scope.requestLoading = false;
	  }else {
	  }
	});
      };
      
      scope.resetFilter = function() {
	scope.filterDtp = {};
	scope.filterDtp.dateRange = {};
	if(scope.pagination.current === 1) { 
	  getDailyResultsPage(1);
	} else {
	  scope.pagination.current = 1;
	}
      };

      scope.filterData = function() {
	if(scope.pagination.current == 1) {
	  getDailyResultsPage(1)
	}else {
	  scope.pagination.current = 1
	}
      };
      
      scope.pageChanged = function(newPage) {
        getDailyResultsPage(newPage);
      };
      
      scope.$watch('teacherDtpTab', function(){
	if(scope.teacherDtpTab === 'true' && dailyCatlogLoaded === false) {
	  dailyCatlogLoaded = true;
	  getFilterSubjects();
	  getDailyResultsPage($routeParams.page || 1);
	}
	
      });
    }]
  }
});

