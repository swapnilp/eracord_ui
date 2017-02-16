'use strict';
var app;

app = angular.module('eracordUiApp.directives');

app.directive('vendorTransactions', function(Restangular) {
  return {
    restrict: 'AE',
    transclude: true,
    templateUrl: 'views/accounts/vendor_transactions.html',
    scope: {
      vendor: '='
    },
    controller: ['$scope', 'Restangular', 'Flash', '$location',  '$window', function(scope, Restangular, Flash, $location, $window){
      var jkci_classes = Restangular.one("jkci_classes", scope.classId);
      var vendor;
      scope.filter = {};
      scope.pagination = {current: 1};

      scope.$watch("vendor", function(){

	if(scope.vendor) { 
	  vendor = Restangular.one("vendors", scope.vendor.id)
	  loadVendorTransactions(1);
	}
      })
      
      var loadVendorTransactions = function(page) {
	vendor.customGET("vendor_transactions", {page: page}).then(function(data) {
	  if(data.success) {
	    scope.transactions = data.vendor_transactions;
	    scope.totalTransactions = data.total_count;
	  }
	});
      }

      scope.resetFilter = function() {
	scope.filter = {};
	if(scope.pagination.current == 1) {
	  loadVendorTransactions(1);
	} else {
	  scope.pagination.current = 1
	}

      };

      scope.filterData = function() {
	if(scope.pagination.current == 1) {
	  loadVendorTransactions(1);
	} else {
	  scope.pagination.current = 1
	}
      };

      scope.pageChanged = function(newPage) {
	loadVendorTransactions(newPage);
      };
      
      
    }]
  }
});
