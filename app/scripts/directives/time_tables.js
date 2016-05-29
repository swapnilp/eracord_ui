'use strict';
var app;

app = angular.module('eracordUiApp.directives');


app.directive('dispalyTimes', function() {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      timeSlots: "="
    },
    templateUrl: 'views/time_tables/time_slots.html',
    controller: ['$scope',function(scope){

    }]
  }
});


app.directive('daySlots', function() {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      day: '@',
      events: '=',
      timeSlots: "=",
      selectedSlot: "=",
      showSlotForm: '=',
      cwday: '='
    },
    templateUrl: 'views/time_tables/day_slots.html',
    controller: ['$scope',function(scope){

      
      scope.timeEvents = {};
      
      scope.checkHeight = function(slot, end_time) {
	return (end_time < slot +1);
      };

      scope.checkTop = function(slot, start_time) {
	return (start_time > slot);
      };

      var createEventSlot = function() {
	_.map(scope.timeSlots, function(slot){
	  scope.timeEvents[slot] = _.filter(scope.events, function(event) { return  (Math.trunc(event.start_time) <= slot && Math.ceil(event.end_time) > slot && event.cwday === scope.cwday)});
	});
      };
      
      scope.selectSlot = function(slot) {
	scope.selectedSlot = slot;
	scope.showSlotForm = false;
      }
      
      scope.$watch('events', function(){
	createEventSlot();
      }, true)
      
      
    }]
  }
});

