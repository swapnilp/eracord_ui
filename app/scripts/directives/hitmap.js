'use strict';
var app;

app = angular.module('eracordUiApp.directives');

app.directive('months', function() {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      startFrom: "@",
      endTo: "@",
      data: "@",
      classId: "@",
      obj: "=",
      showActions: "@"
    },
    templateUrl: 'views/hitmap/months.html',
    controller: ['$scope', 'Restangular', '$uibModal',function(scope, Restangular, $uibModal){
      
      if(scope.endTo == undefined) {
	scope.endTo = moment().format('YYYY-MM');
      }
      
      if(scope.data == undefined) {
	scope.data = {};
      }
      scope.startDate = moment(scope.startFrom, "YYYY-MM").startOf('month')
      scope.endDate = moment(scope.endTo, "YYYY-MM").endOf('month')
      scope.requestLoading = true;

      var monthRange = moment.range(scope.startDate, scope.endDate)
      scope.months = {};
      scope.activities = {};
      scope.max_activities = 0;

      var calculate_hitmap = function() {
	_.each(Array.from(monthRange.by('day', { exclusive: true })), function(day) {
	  if(!_.has(scope.months, day.format("YYYY-MMM"))) {
	    scope.months[day.format("YYYY-MMM")] = {};
	  }
	  if(!_.has(scope.months[day.format("YYYY-MMM")], day.week())) {
	    scope.months[day.format("YYYY-MMM")][day.week()] = {}; 
	  }
	  var toltip = scope.activities[day.format("DD-MM-YYYY")];
	  var size = 0;
	  var d_toltip = "";

	  size = ((255/scope.max_activities) * _.size(toltip));
	  d_toltip = _.uniq(_.map(toltip, 'key')).join(', ')
	  
	  d_toltip = "   " + _.size(toltip) + "  Events  -" + d_toltip;
	  scope.months[day.format("YYYY-MMM")][day.week()][day.day()] = [day.format("DD-MM-YYYY  "), size, d_toltip, size];
	});
      };
      
      var get_activities = function() {
	scope.requestLoading = true;
	var jkci_class = Restangular.one("jkci_classes", scope.classId);
	jkci_class.customGET("get_activities").then(function(data) {
	  scope.activities = data.activities;
	  scope.max_activities = data.max_activities;
	  calculate_hitmap();
	  scope.requestLoading = false;
	});
      };

      scope.openDay = function(day) {
	var modalInstance = $uibModal.open({
	  animation: true,
	  templateUrl: 'views/classes/activities.html',
	  controller: 'ClassActivitiesCtrl',
	  size: 'lg',
	  resolve: {
	    day: function(){
	      return day;
	    },
	    class_id: function(){
	      return scope.classId;
	    }
	  }
	});
      }
      
      scope.$watch('classId', function() {
	get_activities();
      });

    }]
  }
});
