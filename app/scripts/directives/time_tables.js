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
      subjects: '=',
      timeTableId: '=',
      day: '@',
      events: '=',
      timeSlots: "=",
      selectedSlot: "=",
      showSlotForm: '=',
      cwday: '=',
      divisions: '='
    },
    templateUrl: 'views/time_tables/day_slots.html',
    controller: ['$scope', '$uibModal', function(scope, $uibModal){

      
      scope.timeEvents = {};
      
      scope.checkHeight = function(slot, end_time) {
	return (end_time < slot +1);
      };

      scope.checkTop = function(slot, start_time) {
	return (start_time > slot);
      };

      var createEventSlot = function() {
	_.map(scope.timeSlots, function(slot){
	  scope.timeEvents[slot] = _.filter(scope.events, function(event) { return  (Math.floor(event.start_time) <= slot && Math.ceil(event.end_time) > slot && event.cwday === scope.cwday)});
	});
      };
      
      scope.selectSlot = function(slot) {
	scope.selectedSlot = slot;
	scope.showSlotForm = false;
      }

      scope.dropCallback = function(event, ui, dropSubject, slot) {
	var modalInstance = $uibModal.open({
	  animation: true,
	  templateUrl: 'views/time_tables/new_time_slot_model.html',
	  controller: 'TimeTableClassModelCtrl',
	  size: 'lg',
	  resolve: {
	    time_table_id: function(){
	      return scope.timeTableId;
	    },
	    cwday: function(){
	      return scope.cwday;
	    },
	    slot: function(){
	      return slot;
	    },
	    subject_id: function(){
	      return dropSubject.id;
	    },
	    subjects: function(){
	      return scope.subjects;
	    },
	    divisions: function(){
	      return scope.divisions;
	    }
	  }
	});
	
	modalInstance.result.then(null, function () {
	  //getResultsPage(1);
	});
      };

      scope.$watch('events', function(){
	createEventSlot();
      }, true)
    }]
  }
});

