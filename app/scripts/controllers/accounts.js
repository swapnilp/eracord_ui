'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('AccountsCtrl',['$scope', 'lazyFlash', '$location', 'Auth', 'Restangular', '$routeParams', '$window', '_', '$cookieStore', '$uibModal', function ( $scope, lazyFlash, $location, Auth, Restangular, $routeParams, $window, _, $cookieStore, $uibModal) {

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
    $scope.isRemained = false;
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
    
    if($location.path() === '/accounts') {
      $scope.showFilter = true;
      $scope.payments = [];
      $scope.pagination = {current: 1};
      $scope.token = $cookieStore.get('currentUser').token;
      $scope.requestLoading = true;
      
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
	    lazyFlash.warning(data.message);
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
	  get_transactions(row);
	  row.expanded = true;
	}
      };

      $scope.resetFilter = function() {
	$scope.filterAmount = {};
	$scope.isRemained = false;
	$scope.filterAmount.batch = _.findWhere($scope.batches, {is_active: true}).id;
	if($scope.pagination.current == 1) {
	  loadPayments(1);
	} else {
	  $scope.pagination.current = 1
	}

      };

      $scope.filterData = function() {
	if($scope.pagination.current == 1) {
	  loadPayments(1);
	} else {
	  $scope.pagination.current = 1
	}

      };

      var get_transactions = function(row) {
	row.is_loading = true;
	payment_fee.customGET(row.jkci_class_id+"/get_transactions/"+row.student_id).then(function(data) {
	  if(data.success) {
	    row.transactions = data.transactions;
	  }
	  row.is_loading = false;
	});
      }

      $scope.hideInfo = function(row) {
	row.expanded = false;
      };

      $scope.pageChanged = function(newPage, checkFilter) {
	loadPayments(newPage);
      };

      $scope.getRemainingStudents = function() {
	$scope.isRemained = true;
	$scope.filterAmount.remaining = true;
	loadPayments(0);
      };

      loadAmountFilters();
      loadPayments(1);
    };
    //end of index action


    if($location.path() === '/accounts/logs') {
      $scope.payments = [];
      $scope.pagination = {current: 1};
      $scope.requestLoading = false;
      $scope.filter = {};
      $scope.filter.dateRange = {startDate: null, endDate: null};
      
      var loadPayments = function(pageNumber) {
	$scope.requestLoading = true;
	payment_fee.customGET("get_logs", {filter: $scope.filter, page: pageNumber}).then(function(data) {
	  if(data.success) {
	    $scope.logs = data.logs;
	    $scope.amount = data.amount;
	    $scope.totalLogs = data.count;
	  } else {
	    lazyFlash.warning(data.message);
	    $location.path("/admin_desk").replace();
	  }
	  $scope.requestLoading = false;
	});
      };

      $scope.pageChanged = function(newPage, checkFilter) {
	loadPayments(newPage);
      };

      $scope.resetFilter = function() {
	$scope.filter = {};
	$scope.filter.dateRange = {startDate: null, endDate: null};
	if($scope.pagination.current === 1) {
	  loadPayments(1);
	} else {
	  $scope.pagination.current = 1;
	}
      };

      $scope.filterData = function() {
	if($scope.pagination.current === 1) {
	  loadPayments(1);
	} else {
	  $scope.pagination.current = 1;
	}
      };
      
      loadPayments();
    }
    //end of logs

    if($location.path() === '/accounts/graphs') {
      $scope.showFilter = true;
      $scope.length = 1;
      $scope.filter = {};
      $scope.filter.selectedAccountType = 'Both';
      $scope.filter.selectedAccountSpan = 'month';
      $scope.filter.is_remaining = 'All';
      loadAmountFilters();

      $scope.loadGraph = function(){
	$scope.requestLoading = true;
	$scope.labels = [];
	$scope.series = ['Fee'];
	$scope.data = [];

	payment_fee.customGET("graph_data", {filter: $scope.filter}).then(function(data) {
	  if(data.success) {
	    $scope.totalPayments = data.count;
	    $scope.data= [data.values];
	    $scope.labels = data.keys;
	    $scope.totalAmount = data.total_amount;
	    $scope.minDate = data.min_date;
	    $scope.maxDate = data.max_date;
	  } else {
	  }
	  $scope.requestLoading = false;
	});
      };

      $scope.resetFilter = function() {
	$scope.filter = {};
	$scope.filter.selectedAccountType = 'Both';
	$scope.filterAmount = {};
	$scope.filter.batch = _.findWhere($scope.batches, {is_active: true}).id;
	$scope.loadGraph();
      };
      
      
      $scope.loadGraph();
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

    if($location.path() === '/accounts/print_account') {
      $scope.reqLoading = true;
     
      payment_fee.customGET("print_account", {filter: $routeParams.filter}).then(function(data) {
	$scope.data = data.data;
	$scope.reqLoading = false;
      });
    }

    if($location.path() === '/accounts/vendors') {
      $scope.requestLoading = true;
      $scope.pagination = {current: 1};
      $scope.filter = {};
      var vendor = Restangular.all("vendors");
      
      var loadVendors = function(page) {
	$scope.requestLoading = true;
	vendor.customGET("", {page: page, filter: $scope.filter}).then(function(data) {
	  if(data.success) {
	    $scope.vendors = data.vendors;
	    $scope.totalVendors = data.total_count;
	    $scope.requestLoading = false;
	  } else {
	    $location.path("/admin_desk").replace();
	  }
	});
      }

      $scope.openNewVendorModel = function(size) {
	var modalInstance = $uibModal.open({
	  animation: true,
	  templateUrl: 'views/accounts/new_vendor.html',
	  controller: 'NewVendorModelCtrl',
	  size: size,
	  resolve: {
	    vendor_id: function(){
	      return null;
	    }
	  }
	});

	modalInstance.result.then( function () {
	  loadVendors(1);
	}, null);
      };
      
      $scope.resetFilter = function() {
	$scope.filter = {};
	if($scope.pagination.current == 1) {
	  loadVendors(1);
	} else {
	  $scope.pagination.current = 1
	}

      };

      $scope.filterData = function() {
	if($scope.pagination.current == 1) {
	  loadVendors(1);
	} else {
	  $scope.pagination.current = 1
	}
      };

      $scope.pageChanged = function(newPage, checkFilter) {
	loadVendors(newPage);
      };
      
      loadVendors(1);
    }
    //Vendor Index END

    if($location.path() === '/accounts/vendors/logs') {
      $scope.requestLoading = true;
      $scope.filter = {};
      $scope.logs = [];
      $scope.pagination = {current: 1};
      $scope.totalLogs = 0;
      $scope.filter.dateRange = {startDate: null, endDate: null};
      
      var vendor = Restangular.all("vendors");
      var loadVendorsLogs = function(page) {
	$scope.requestLoading = true;
	vendor.customGET("get_logs", {page: page, filter: $scope.filter}).then(function(data) {
	  if(data.success) {
	    $scope.logs = data.logs;
	    $scope.totalLogs = data.total_logs;
	    $scope.requestLoading = false;
	  } else {
	    $location.path("/accounts/vendors").replace();
	  }
	}, function(){
	  $location.path("/accounts/vendors").replace();
	});
      }
      loadVendorsLogs(1);

      $scope.pageChanged = function(newPage, checkFilter) {
	loadVendorsLogs(newPage);
      };

      $scope.resetFilter = function() {
	$scope.filter = {};
	$scope.filter.dateRange = {startDate: null, endDate: null};
	if($scope.pagination.current === 1) {
	  loadVendorsLogs(1);
	} else {
	  $scope.pagination.current = 1;
	}
      };

      $scope.filterData = function() {
	if($scope.pagination.current === 1) {
	  loadVendorsLogs(1);
	} else {
	  $scope.pagination.current = 1;
	}
      };
    }
    //Vendors logs END


    if($location.path() === '/accounts/vendors/' + $routeParams.vendor_id) {
      $scope.requestLoading = true;
      
      var vendor = Restangular.all("vendors");
      var loadVendor = function() {
	vendor.customGET(""+ $routeParams.vendor_id).then(function(data) {
	  if(data.success) {
	    $scope.vendor = data.vendor;
	    $scope.requestLoading = false;
	  } else {
	    $location.path("/accounts/vendors").replace();
	  }
	}, function(){
	  $location.path("/accounts/vendors").replace();
	});
      }

      $scope.openEditVendorModel = function(size) {
	var modalInstance = $uibModal.open({
	  animation: true,
	  templateUrl: 'views/accounts/new_vendor.html',
	  controller: 'NewVendorModelCtrl',
	  size: size,
	  resolve: {
	    vendor_id: function(){
	      return $scope.vendor.id;
	    }
	  }
	});

	modalInstance.result.then( function () {
	  loadVendor();
	}, null);
      };

      $scope.openVendorTransactionModel = function(size) {
	var modalInstance = $uibModal.open({
	  animation: true,
	  templateUrl: 'views/accounts/new_vendor_transaction.html',
	  controller: 'VendorTransactionModelCtrl',
	  size: size,
	  resolve: {
	    vendor_id: function(){
	      return $scope.vendor.id;
	    }
	  }
	});

	modalInstance.result.then( function () {
	  loadVendor();
	}, null);
      };
      
      loadVendor();
    }
    //Vendor show END

  }])

  .controller('NewVendorModelCtrl',['$scope', '$filter',  '$uibModalInstance', 'Restangular', 'vendor_id', function ($scope, filter, $uibModalInstance, Restangular, vendor_id) {
      
    $scope.vm = {};
    
    $scope.text= "New";
    var vendor = Restangular.all("vendors");

    var loadVendor = function() {
      vendor.customGET(""+vendor_id+"/edit").then(function(data) {
	if(data.success) {
	  $scope.vm = data.vendor;
	} else {
	  $scope.cancel();
	}
      });
    }
    if( vendor_id) {
      $scope.text= "Edit";
      loadVendor();
    }

    $scope.registerVendor = function() {
      if(vendor_id) {
	vendor.customPUT({vendor: $scope.vm}, ""+ vendor_id, {}).then(function(data) {
	  if(data.success) {
	    $uibModalInstance.close(true);
	  } else {
	    $scope.cancel();
	  }
	});
	
      } else {
	vendor.customPOST({vendor: $scope.vm}, "", {}).then(function(data) {
	  if(data.success) {
	    $uibModalInstance.close(true);
	  } else {
	    $scope.cancel();
	  }
	})
      }
    };
    
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
    
    $scope.cancelTimeTableSlotManage = function () {
      $uibModalInstance.dismiss('cancel');
    };
    
  }])

  .controller('VendorTransactionModelCtrl',['$scope', '$filter',  '$uibModalInstance', 'Restangular', 'vendor_id', function ($scope, filter, $uibModalInstance, Restangular, vendor_id) {
    
    $scope.vm = {};
    $scope.text= "New";
    $scope.vm.isOpen = false; //for calender 
    $scope.vm.transaction_type= "Debit";
    var vendor = Restangular.one("vendors", vendor_id);
    
    
    $scope.registerVendorTransaction = function() {
      $scope.vm.issue_date = moment($scope.vm.date).format('DD/MM/YYYY');
      
      vendor.customPOST({vendor_transaction: $scope.vm}, "vendor_transactions", {}).then(function(data) {
      	if(data.success) {
      	  $uibModalInstance.close(true);
      	} else {
      	  $scope.cancel();
      	}
      })
    };
    
    $scope.openCalendar = function(e) {
      e.preventDefault();
      e.stopPropagation();
      $scope.vm.isOpen = true;
    };
    
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
    
    $scope.cancelTimeTableSlotManage = function () {
      $uibModalInstance.dismiss('cancel');
    };
    
  }]);


