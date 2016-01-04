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
      
      jkci_classes.customGET('get_timetable').then(function(data){
	if(data.success){
	  $scope.time_table = data.time_table;
	} else {
	}
      });

      
      $scope.openCalendar = function(e) {
        e.preventDefault();
        e.stopPropagation();
        $scope.isOpen = true;
      };
      
      $scope.deleteSlot = function(slot) {
	$scope.events = _.reject($scope.events, function(d){ return d.id === slot.id; });
	$scope.selectedSlot = null;
      };
      
      
      $scope.createTimeTableSlot = function() {
	$scope.vm = {};
	$scope.showSlotForm = true;
	$scope.selectedSlot = null;
      };
      
      $scope.cancelTimeTableSlotManage = function() {
	$scope.vm = {};
	$scope.showSlotForm = false;
	$scope.selectedSlot = null;
      };
      
      $scope.nullSelect = function() {
	$scope.selectedSlot = null;
      }

      $scope.registorTimeTableSlot = function() {
	$scope.vm.start_time = $filter('date')($scope.start_time, "HH:mm");
	console.log($scope.vm);
      }
      
      $scope.events = [
	{id: 1,
	   start_time: 1,
	   end_time: 3,
	   color: 'red',
	   name: 'physics'
	},
	{id: 2,
	   start_time: 1.30,
	   end_time: 3,
	   color: 'green',
	   name: 'Chem'
	},
	{id: 3,
	   start_time: 6,
	   end_time: 8,
	   color: 'blue',
	   name: "Bio"
	},
	{id: 4,
	   start_time: 1.5,
	   end_time: 7.5,
	   color: 'yellow',
	   name: "Maths"
	}
      ];
      
    };
    // end of calender manage path
  }]);
