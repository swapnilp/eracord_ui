'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('ClassRoomsCtrl',['$scope', 'Restangular', 'Flash', '$location', '$window', '$routeParams', '$route' ,'Auth', function($scope, Restangular, Flash, $location, $window, $routeParams, $route, Auth) {


    if(!Auth.isAuthenticated()){
      $location.path('/user/sign_in');
      return true;
    }
    var class_rooms = Restangular.all("organisations");;

    
    if($location.path() === "/class_rooms"){
      $scope.isOpencal = false;
      $scope.isOpenend = false;
      $scope.showFilter = true;
      $scope.days = {
	1: 'Monday',
	2: 'Tuesday',
	3: 'Wednesday',
	4: 'Thusday',
	5: 'Friday',
	6: 'Saturday',
	7: 'Sunday'
      };
      $scope.length = 0;
      $scope.vm = {};


      $scope.openCalendar = function($event, prop) {
	$scope.isOpencal = true;
      };
      $scope.openCalendarEnd = function($event, prop) {
	$scope.isOpenend = true;
      };

      $scope.getClassRooms = function(){
	class_rooms.customGET("get_class_rooms", {filter: $scope.vm}).then(function(data){
	  $scope.vm.selectedWeekDay = data.cwday + "";
	  $scope.vm.class_time = new Date(data.time);
	  $scope.vm.end_time = new Date(data.end_time);
	  $scope.class_rooms = data.class_rooms;
	  $scope.length = $scope.class_rooms.length;
	});
      };
      
      $scope.getCurrentTimeClasses = function() {
	$scope.vm = {};
	$scope.getClassRooms();
      };
      
      $scope.getClassRooms();
    };

    
}]);
