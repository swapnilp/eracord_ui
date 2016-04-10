'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('AccountsCtrl',['$scope', 'Flash', '$location', 'Auth', 'Restangular', '$routeParams', '$window', '_', '$cookieStore', function ( $scope, Flash, $location, Auth, Restangular, $routeParams, $window, _, $cookieStore) {

    if(!Auth.isAuthenticated()){
      $location.path('/user/sign_in').replace();
      return true;
    }

    if ($cookieStore.get('currentUser') === undefined) {
      $scope.eventSources = [];
      $location.path('/user/sign_in').replace();
      return true;
    }
    
    $scope.batches = [];
    $scope.filterAmount = {};
    var payment_fee = Restangular.all("student_fees");
    var loadAmountFilters  = function(){
      payment_fee.customGET("filter_data").then(function(data) {
	if(data.success) {
	  $scope.batches = data.batches;
	  $scope.standards = data.standards;
	  $scope.filterAmount.batch = _.findWhere($scope.batches, {is_active: true}).id;

	} 
      });
    };
    
    $scope.resetFilter = function() {
      $scope.filterAmount = {};
      $scope.filterAmount.batch = _.findWhere($scope.batches, {is_active: true}).id;
      loadPayments(1);
    };
    
    if($location.path() === '/accounts') {
      $scope.showFilter = true;
      $scope.payments = [];
      $scope.pagination = {current: 1};
      
      var loadPayments = function(pageNumber){
	$scope.requestLoading = true;
	payment_fee.customGET("", {filter: $scope.filterAmount, page: pageNumber}).then(function(data) {
	  if(data.success) {
	    $scope.payments = data.payments;
	    $scope.totalAmount = data.total_amount;
	    $scope.length = $scope.payments.length; 
	    $scope.totalPayments = data.count;
	  } else {
	  }
	  $scope.requestLoading = false;
	});
      };
      
      $scope.pageChanged = function(newPage, checkFilter) {
	loadPayments(newPage);
      };
      
      loadAmountFilters();
      loadPayments(1);
    };

    //end of index action
    if($location.path() === '/accounts/graphs') {
      $scope.showFilter = true;
      $scope.length = 1;
      
      loadAmountFilters();

      $scope.loadPayments = function(){
	$scope.requestLoading = true;
	$scope.labels = [];
	$scope.series = ['Amount'];
	$scope.data = [];
	payment_fee.customGET("graph_data", {filter: $scope.filterAmount}).then(function(data) {
	  if(data.success) {
	    $scope.totalPayments = data.count;
	    $scope.labels = data.values;
	    $scope.data = [data.keys];
	  } else {
	  }
	  $scope.requestLoading = false;
	});
      };
      $scope.loadPayments();
    }
    
  }]);


