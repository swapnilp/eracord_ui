'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('HolidaysCtrl',['$rootScope', '$scope', 'Flash', 'lazyFlash', '$location', 'Auth', 'Restangular', '$routeParams', '$uibModal', '$window', function ($rootScope, $scope, Flash, lazyFlash, $location, Auth, Restangular, $routeParams, $uibModal, $window) {
    
    
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

      $scope.removeHoliday = function(row) {
	if($window.confirm('Are you sure?')){
	  holidays.customDELETE(row.id).then(function(data){
	    if(data.success) {
	      $scope.filterData();
	    } else {
	      Flash.clear();
	      Flash.create('warning', data.message, 0, {}, true);
	    }
	  });
	}
      };

      getResultsPage(1);
    }
    //end of index route

    if($location.path() === "/holidays/new") {
      var holidays = Restangular.all("holidays");
      
      $scope.isOpen = false;
      $scope.dataLoading = false;
      $scope.classLoading = false;
      $scope.vm = {};
      $scope.dateRange = {};
      $scope.vm.isMultiDate = false;
      $scope.vm.classList = [];
      $scope.allOrganisation = true;
      $scope.vm.date = moment();
      $scope.openCalendar = function(e) {
        e.preventDefault();
        e.stopPropagation();
        $scope.isOpen = true;
      };

      $scope.maxDate = moment().add(5, 'months').format("'MM-DD-YY'");
      $scope.minDate = moment().format("'MM-DD-YY'");
      $scope.dateOptions = {
      	maxDate: $scope.maxDate,
	minDate: $scope.minDate
      };


      $scope.$watch('allOrganisation', function(){
	if(!$scope.allOrganisation) {
	  loadClasses();
	} else{
	  $scope.vm.classList = [];
	}
      });

      var loadClasses = function() {
	$scope.classes = [];
	$scope.classLoading = true;
	holidays.customGET("get_classes").then(function(data) {
	  if(data.success) {
	    $scope.classes = data.classes;
	  } else {
	  }
	  $scope.classLoading = false;
	});
      };

      $scope.registerHoliday = function() {
	if($scope.vm.isMultiDate === false) {
	  $scope.vm.date = moment($scope.vm.date).format('DD/MM/YYYY');
	}
	$scope.vm.allOrganisation = $scope.allOrganisation;
	$scope.vm.classList = $scope.vm.classList.join(',');
	if($scope.vm.allOrganisation === false && $scope.vm.classList === "") {
	  Flash.clear();
	  Flash.create('warning', "Must select class for specific class", 10000, {}, true);
	  $scope.vm.classList = [];
	  if($scope.vm.isMultiDate === false){
	    $scope.vm.date = moment($scope.vm.date, 'DD/MM/YYYY');
	  }
	  return 0
	}
	
	holidays.customPOST({holiday: $scope.vm}, "", {dateRange: $scope.dateRange}).then(function(data) {
	  if(data.success) {
	    lazyFlash.success("Holiday has been created");
	    $location.path("/holidays").replace();
	  } else {
	    Flash.clear();
	    Flash.create('warning', "Something went wrong", 0, {}, true);
	  }
	});
      };
    }
    
  }])
