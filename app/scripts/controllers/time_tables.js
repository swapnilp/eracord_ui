'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('TimeTablesCtrl',['$scope', 'Flash', '$location', 'Auth', 'Restangular', '$routeParams', '$filter', function ($scope, Flash, $location, Auth, Restangular, $routeParams, $filter) {
    
    //var message = '<strong>Well done!</strong> You successfully read this important alert message.';
    
    if(!Auth.isAuthenticated()){
      $location.path('/user/sign_in');
      return true;
    };

    if($location.path() === "/classes/"+$routeParams.class_id+"/time_tables/new") {
      var jkci_classes = Restangular.one("jkci_classes", $routeParams.class_id);
      $scope.classId = $routeParams.class_id;
      $scope.isOpen = false; //for calender 
      $scope.vm = {};
      
      $scope.openCalendar = function(e) {
        e.preventDefault();
        e.stopPropagation();
	$scope.isOpen = true;
      };

      jkci_classes.get().then(function(data){
	$scope.classes = data.jkci_class;
      });

      $scope.registorTimeTable = function(){
	$scope.vm.start_time = $scope.start_time.getHours() + ":" + $scope.start_time.getMinutes();
	
	jkci_classes.customPOST({time_table: $scope.vm}, "time_tables").then(function(data) {
	  if(data.success) {
	    $location.path("/classes/"+$scope.classId).replace();
	  }else {
	    
	  }
	});
      }
      
    };
    // end of time table new path 

    if($location.path() === "/classes/"+$routeParams.class_id+"/manage_time_tables") {
      var jkci_classes = Restangular.one("jkci_classes", $routeParams.class_id);
      $scope.classId = $routeParams.class_id;
      $scope.timeSlots = _.range(1,24);
      $scope.selectedSlot = null;
      $scope.showSlotForm = false;
      $scope.vm = {};
      $scope.isOpen = false;
      $scope.isOpenEndDate = false
      $scope.days = {
	1: 'Monday',
	2: 'Tuesday',
	3: 'Wednesday',
	4: 'Thusday',
	5: 'Friday',
	6: 'Saturday'
      };
      $scope.events = [];
      
      
      jkci_classes.customGET('get_timetable').then(function(data){
	if(data.success){
	  $scope.time_table = data.time_table;
	  $scope.subjects = data.subjects;
	  $scope.events = data.slots;
	} else {
	}
      });

      
      $scope.openCalendar = function(e) {
        e.preventDefault();
        e.stopPropagation();
        $scope.isOpen = true;
      };

      $scope.openEndCalendar = function(e) {
        e.preventDefault();
        e.stopPropagation();
        $scope.isOpenEndDate = true;
      };
      
      $scope.deleteSlot = function(slot) {
	var time_table_rec = Restangular.one("time_tables", $scope.time_table.id);
	time_table_rec.one("time_table_classes", slot.id).remove().then(function(data){
	  if(data.success) {
	    $scope.events = _.reject($scope.events, function(d){ return d.id === slot.id; });
	    $scope.selectedSlot = null;
	  } else {
	  }
	});
      };

      $scope.editTimeTableSlot= function(selectedSlot) {
	$scope.vm.id = selectedSlot.id;
	$scope.vm.subject_id = selectedSlot.subject_id;
	$scope.vm.cwday = ""+selectedSlot.cwday;
	$scope.vm.slot_type = selectedSlot.slot_type;
	$scope.start_time = new Date("3/3/1016 "+ (""+selectedSlot.start_time).replace(".", ":"));
	$scope.end_time = new Date("3/3/1016 "+ (""+selectedSlot.end_time).replace(".", ":"));
	$scope.showSlotForm = true;
	$scope.selectedSlot = null;
      };
      
      
      $scope.createTimeTableSlot = function() {
	$scope.vm = {};
	$scope.showSlotForm = true;
	$scope.end_time = null;
	$scope.start_time = null;
	$scope.selectedSlot = null;
      };
      
      $scope.cancelTimeTableSlotManage = function() {
	$scope.vm = {};
	$scope.showSlotForm = false;
	$scope.end_time = null;
	$scope.start_time = null;
	$scope.selectedSlot = null;
      };
      
      $scope.nullSelect = function() {
	$scope.selectedSlot = null;
      };

      $scope.registorTimeTableSlot = function() {
	$scope.vm.time_table_id = $scope.time_table.id;
	$scope.vm.start_time = $filter('date')($scope.start_time, "HH:mm");
	$scope.vm.end_time = $filter('date')($scope.end_time, "HH:mm");
	var millisecondsPerHour = 1000 * 60;
	$scope.vm.durations = Math.round(($scope.end_time - $scope.start_time)/millisecondsPerHour);
	if($scope.vm.slot_type !== 'Class') {
	  $scope.vm.subject_id = null;
	}
	var time_tables = Restangular.one("time_tables", $scope.time_table.id);
	if($scope.vm.id){
	  time_tables.customPUT({time_table_class: $scope.vm}, "time_table_classes/"+ $scope.vm.id, {}).then(function(data) {
	    if(data.success) {
	      $scope.events = _.reject($scope.events, function(d){ return d.id === $scope.vm.id; });
	      $scope.events.push(data.slot);
	      $scope.cancelTimeTableSlotManage();
	    } else {
	    }
	  });
	} else {
	  time_tables.customPOST({time_table_class: $scope.vm}, "time_table_classes", {}).then(function(data) {
	    $scope.events.push(data.slot);
	    $scope.cancelTimeTableSlotManage();
	  });
	}
      };
    };
    // end of calender manage path
  }]);
