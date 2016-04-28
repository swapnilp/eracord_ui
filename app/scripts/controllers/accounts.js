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
    var loadAmountFilters  = function() {
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
      
      var loadPayments = function(pageNumber) {
	$scope.requestLoading = true;
	payment_fee.customGET("", {filter: $scope.filterAmount, page: pageNumber}).then(function(data) {
	  if(data.success) {
	    $scope.payments = data.payments;
	    $scope.totalAmount = data.total_amount;
	    $scope.totalTax = data.total_tax;
	    $scope.length = $scope.payments.length; 
	    $scope.totalPayments = data.count;
	    $scope.expectedAmount = data.expected_fees;
	    $scope.totalStudents = data.total_students;
	  } else {
	    Flash.create('warning', data.message, 'alert-danger');
	    $location.path("/admin_desk").replace();
	  }
	  $scope.requestLoading = false;
	});
      };

      $scope.openInfo = function(row) {
	if(row.expanded === true) {
	  _.map($scope.payments, function(payment){ payment.expanded = false;})
	}else{
	  _.map($scope.payments, function(payment){ payment.expanded = false;})
	  row.expanded = true;
	}
      };

      $scope.hideInfo = function(row) {
	row.expanded = false;
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
    // end of graph action 

    
    if($location.path() === '/accounts/students/' + $routeParams.student_id + '/fee_receipt/' + $routeParams.receipt_id) {
      $scope.reqLoading = true;
      
      payment_fee.customGET($routeParams.receipt_id +"/print_receipt", {student_id: $routeParams.student_id}).then(function(data) {
	$scope.data = data.print_data;
	$scope.reqLoading = false;
      });
    }
    // end of print receipt
  }]);


