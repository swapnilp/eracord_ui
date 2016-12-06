'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */


angular.module('eracordUiApp.controller')
  .controller('OffClassesCtrl',['$rootScope', '$scope', 'Flash', '$location', 'Auth', 'Restangular', '$routeParams', 'Upload', '$window', '$cookieStore', '$uibModal', function ($rootScope, $scope, Flash, $location, Auth, Restangular, $routeParams, Upload, $window, $cookieStore, $uibModal) {

    if(!Auth.isAuthenticated()){
      $location.path('/user/sign_in').replace();
      return true;
    };
    if ($cookieStore.get('currentUser') === undefined) {
      $scope.eventSources = [];
      $location.path('/user/sign_in').replace();
      return true;
    }

    $scope.token = $cookieStore.get('currentUser').token;
    
    if($location.path() === '/off_classes') {

      $scope.off_classes = [];
      $scope.teachers = [];
      $scope.classes = [];
      $scope.filterOffClass = {};
      $scope.filterOffClass.dateRange = {};
      $scope.requestLoading = true;
      $scope.pagination = {current: 1};
      $scope.totalOffClasses = 0;
      $scope.showResetFilter = false;
      
      var base_off_classes = Restangular.all("off_classes");
      
      var get_filter_data = function(){
	base_off_classes.customGET("get_filter_data").then(function(data) {
	  if(data.success) {
	    $scope.teachers = data.teachers;
	    $scope.classes = data.standards;
	  }
	});
      }
      var getResultsPage = function(pageNumber, checkFilter) {
	if(!checkFilter && _.size($scope.filterOffClass) === 0) {
	  return true;
	}
	if(_.size($scope.filterOffClass) >  0) {
	  $scope.showResetFilter = true;
	}
	$scope.requestLoading = true;
	base_off_classes.customGET("", {page: pageNumber, filter: $scope.filterOffClass}).then(function(data) {
	  if(data.success) {
	    $scope.off_classes = data.off_classes;
	    $scope.totalOffClasses = data.count;
	    $scope.pagination = {current: pageNumber || 1};
	  }
	  $scope.requestLoading = false;
	});
      };
      
      $scope.resetFilter = function() {
	$scope.filterOffClass ={}
	$scope.filterOffClass.dateRange = {};
	$scope.showResetFilter = false;
	if($scope.pagination.current === 1) {
	  getResultsPage(1, true);
	} else {
	  $scope.pagination.current = 1;
	}
	
      };
      
      $scope.pageChanged = function(newPage, checkFilter) {
	getResultsPage(newPage, checkFilter);
      };

      get_filter_data();
      getResultsPage(1, true);

      
    }
    //end of off_classes index
  }]);
