'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('HolidaysCtrl',['$rootScope', '$scope', 'Flash', 'lazyFlash', '$location', 'Auth', 'Restangular', '$routeParams', '$uibModal', function ($rootScope, $scope, Flash, lazyFlash, $location, Auth, Restangular, $routeParams, $uibModal) {
    
    
    if(!Auth.isAuthenticated()){
      $location.path('/user/sign_in');
      return true;
    }

    if($location.path() === "/holidays") {
      var holidays = Restangular.all("holidays");
      $scope.requestLoading = true;
      $scope.filter = {};
      $scope.filter.dateRange = {};
      $scope.pagination = {
        current: 1
      };
      
      var getResultsPage = function(page) {
	$scope.requestLoading = true;
	holidays.customGET("", {filter: $scope.filter, page: page}).then(function(data){
	  if(data.success){
	    $scope.holidays = data.holidays;
	    $scope.totalCount = data.total_count;
	  }else {
	    lazyFlash.warning(data.message);
	    $location.path("/admin_desk").replace();
	  }
	  $scope.requestLoading = false;
	});
      }
      
      $scope.resetFilter = function() {
	$scope.filter = {};
	$scope.filter.dateRange = {};
	$scope.showResetFilter = false;
	if($scope.pagination.current === 1) {
	  getResultsPage(1, true);
	} else {
	  $scope.pagination.current = 1;
	}
      };

      $scope.filterData = function() {
	if($scope.pagination.current == 1) {
	  getResultsPage(1);
	}else {
	  $scope.pagination.current = 1
	}
      };
      
      $scope.pageChanged = function(newPage) {
        getResultsPage(newPage);
      };

      getResultsPage(1);
    }
    //end of index route

    if($location.path() === "/holidays/new") {
      var holidays = Restangular.all("holidays");
      

      $scope.isOpen = false;
      $scope.dataLoading = false;
      $scope.vm = {};
      $scope.openCalendar = function(e) {
        e.preventDefault();
        e.stopPropagation();
        $scope.isOpen = true;
      };

      $scope.registerHoliday = function() {
	$scope.vm.date = moment($scope.vm.date).format('DD/MM/YYYY');
	holidays.customPOST({holiday: $scope.vm}, "", {}).then(function(data) {
	  if(data.success) {
	    lazyFlash.success("Holiday has been created");
	    $location.path("/holidays").replace();
	  } else {
	    Flash.create('warning', "Something went wrong", 0, {}, true);
	  }
	});
      };
    }
    
  }])
