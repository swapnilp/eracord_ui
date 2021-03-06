'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('StudentsCtrl',['$rootScope', '$scope', 'Flash', 'lazyFlash', '$location', 'Auth', 'Restangular', '$routeParams', 'Upload', '$window', '$cookieStore', '$uibModal', 'FileReader', function ($rootScope, $scope, Flash, lazyFlash, $location, Auth, Restangular, $routeParams, Upload, $window, $cookieStore, $uibModal, FileReader) {
    
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
    var payment_fee = Restangular.all("student_fees");
    
    if($location.path() === '/students') {
      var students = Restangular.all("students");

      $scope.requestLoading = true;
      $scope.classes = [];
      $scope.isFilter = true;
      $scope.newStudent = true;
      $scope.filter = {}
      
      $scope.pagination = {
        current: 1
      };

      var getfilterValues = function() {
	students.customGET("get_filter_values").then(function(data) {
	  if(data.success) {
	    $scope.classes = data.classes;
	  }
	});
      };

      $scope.resetFilter = function() {
	$scope.filter = {};
	if($scope.pagination.current == 1) {
	  getResultsPage(1);
	}else {
	  $scope.pagination.current = 1
	}
      };

      $scope.filterData = function() {
	if($scope.pagination.current == 1) {
	  getResultsPage(1);
	}else {
	  $scope.pagination.current = 1
	}
      };

      var getResultsPage = function(pageNumber) {
	$scope.requestLoading = true;
	students.getList({page: pageNumber, filter: $scope.filter}).then(function(data){
	  $scope.students = data[0];
	  $scope.totalStudents = data[1] || 0;
	  if(data[2]){
	    $scope.has_show_pay_info = data[2].has_show_pay_info;
	    $scope.has_pay_fee = data[2].has_pay_fee;
	  }
	  $scope.requestLoading = false;
	});
      };
      
      $scope.pageChanged = function(newPage) {
        getResultsPage(newPage);
      };

      getfilterValues();

      getResultsPage(1);

      $scope.openInfo = function(row) {
	if(row.expanded === true) {
	  _.map($scope.students, function(student){ student.expanded = false;})
	}else {
	  _.map($scope.students, function(student){ student.expanded = false;})
	  row.expanded = true;
	}
      };
    };

    if($location.path() === '/students/new' || $location.path() === "/classes/" + $routeParams.class_id + "/students/new"){
      var students = Restangular.all("students");
      $scope.initl = 'Mr';
      $scope.gender = 'Male';
      $scope.optionalSubjects = [];
      $scope.classStudents = !_.isUndefined($routeParams.class_id);
      $scope.vm = {};
      $scope.text = "New";
      $scope.requestLoading = true;
      $scope.dataLoading = false;

      students.customGET("new", {class_id: $routeParams.class_id}).then(function(data){
	$scope.standards = data.standards;
	$scope.batches = data.batches;
	if($scope.classStudents){
	  $scope.oSubjects= data.subjects;
	}
	$scope.requestLoading = false;
      });
      
      $scope.selectOptionalSubject = function(){
	Restangular.one("standards", $scope.vm.user.standard_id).customGET("optional_subjects").then(function(data){
	  $scope.oSubjects= data.subjects;
	})
      }
      
      $scope.registerStudent = function(){
	$scope.dataLoading = true;
	$scope.vm.user.o_subjects = $scope.optionalSubjects;
	$scope.vm.user.initl = $scope.initl;
	$scope.vm.user.gender = $scope.gender;
	if($scope.classStudents){
	  $scope.vm.user.standard_id = $scope.standards[0].id;
	  $scope.vm.user.batch_id = $scope.batches[0].id;
	}
	students.post($scope.vm.user, {class_id: $routeParams.class_id}).then(function(data) {
	  if(data.success) {
	    if($scope.classStudents) {
	      $location.path("/classes/"+$routeParams.class_id+"/manage_class").replace();
	    } else {
	      $location.path("/students/"+data.student_id+"/show").replace();
	    }
	    
	  }else {
	    Flash.clear();
	    Flash.create('warning', data.message, 0, {}, true);
	  }
	  $scope.dataLoading = false;
	})
      }  
    };
    // end of new path

    if($location.path() === "/students/" + $routeParams.student_id + "/show"){
      var student = Restangular.one("students", $routeParams.student_id);
      $scope.labels = [];
      $scope.series = ['Time'];
      $scope.data = [];
      $scope.classes = [];
      $scope.selectedTimeZone = 'month';
      $scope.selectedGraphType = 'all';
      $scope.studentLoading = true;
      $scope.editImage = false;
      $scope.afterUpload = false;
      
      var loadStudent = function() {
	student.get().then(function(data){
	  if(data.success) {
	    $scope.student = data.body.student_show;
	    $scope.has_show_pay_info = data.has_show_pay_info;
	    $scope.has_pay_fee = data.has_pay_fee;
	    $scope.remaining_fee = data.remaining_fee
	    $scope.classes = data.classes;
	    $scope.classes = data.classes;
	    $scope.studentLoading = false;
	  } else {
	    $location.path("/students").replace();
	  }

	});
      };
      
      var loadGraph = function() {
	student.customGET("get_graph_data", {time_zone: $scope.selectedTimeZone, type: $scope.selectedGraphType}).then(function(data){
	  if(data.success){
	    $scope.labels = data.keys;
	    $scope.data = data.values;
	    $scope.series = data.header
	  }
	});
      }

      $scope.editPicture = function() {
	$scope.editImage = true;
      };

      $scope.closeEditPicture = function() {
	$scope.editImage = false;
      };
      
      $scope.selectUploadFile = function(newVal){
	if(newVal){
	  $scope.file = newVal;
	  $scope.uploadingFile = false;
	  $scope.fileName  = newVal.name;
	}
      };

      $scope.submit = function() {
	if ($scope.file) {
	  $scope.uploadingFile = true;
	  $scope.uploadMeaasgeClass = "alert-warning";
	  $scope.uploadingMessage = "Uploading";
          $scope.upload($scope.file);
	}
      };

      $scope.upload = function (file) {
	Flash.clear();
	Flash.create('warning', "Uploading Photo is deprecated" , 0, {}, true);
	//$scope.requestLoading = true;
        //Upload.upload({
        //  url: "api/students/" + $routeParams.student_id + "/upload_photo",
        //  data: {student: {file: file}}
        //}).then(function (resp) {
	//  $scope.requestLoading = false;
	//  if(resp.data.success) {
	//    $scope.uploadMeaasgeClass = "alert-success";
	//    $scope.uploadingMessage = "Completed Successfully";
	//    $scope.fileName = "";
	//    FileReader.readAsDataURL(file, $scope).then(function(result) {
	//      $scope.uploadedImg = result;
	//      $scope.afterUpload = true;
	//      $scope.file = null;
	//      $scope.editImage = false;
        //    });
	//  }else {
	//    $scope.uploadMeaasgeClass = "alert-danger";
	//    $scope.uploadingMessage = resp.data.message;
	//  }
        //}, function (resp) {
	//  $scope.requestLoading = false;
	//  $scope.uploadingFile = false;
        //}, function (evt) {
	//  $scope.requestLoading = false;
        //  //var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        //});
      };

      $scope.cancelTakePicture = function() {
	$scope.editImage = false;
      }

      $scope.loadGraphByType = function(type) {
	$scope.selectedGraphType = type;
	loadGraph();
      };
      
      $scope.loadGraphByTime = function(time) {
	$scope.selectedTimeZone = time;
	loadGraph();
      };

      $scope.toggleStudentSms = function() {
	student.customPOST({enable_sms: $scope.student.enable_sms}, "toggle_sms", {}).then(function(data){
	  $scope.student.enable_sms = data.enable_sms; 
	});
      };

      $scope.allotmentHostel = function(size) {
	var modalInstance = $uibModal.open({
	  animation: true,
	  templateUrl: 'views/students/hostel_allotment.html',
	  controller: 'StudentHostelAllotmentCtrl',
	  size: size,
	  resolve: {
	    student_id: function(){
	      return $routeParams.student_id;
	    }
	  }
	});

	modalInstance.result.then(null, function () {
	  loadStudent();//getHostelRooms();
	});
      };
      
      loadStudent();
      loadGraph();
      
      $scope.onClick = function (points, evt) {
      };
    };
    // end of show path
    
    if($location.path() === "/students/" + $routeParams.student_id + "/edit"){
      $scope.student_id = $routeParams.student_id;
      var student = Restangular.one("students", $routeParams.student_id);
      $scope.vm = {};
      $scope.text = "Edit";
      $scope.requestLoading = true;
      $scope.dataLoading = false;

      $scope.selectOptionalSubject = function(){
	Restangular.one("standards", $scope.vm.user.standard_id).customGET("optional_subjects").then(function(data){
	  $scope.oSubjects= data.subjects;
	})
      }
      
      student.customGET('edit').then(function(data){
	if(data.success) {
	  $scope.batches = data.batches;
	  $scope.standards = data.standards;
	  $scope.oSubjects= data.subjects;
	  $scope.vm.user = data.student;
	  $scope.initl = data.student.initl;
	  $scope.gender = data.student.gender;
	  $scope.optionalSubjects = data.o_subjects;
	  //$scope.optionalSubjects = data.student.
	}
	$scope.requestLoading = false;
      });

      $scope.registerStudent = function() {
	$scope.dataLoading = true;
	$scope.vm.o_subjects = $scope.optionalSubjects;
	$scope.vm.user.initl = $scope.initl;
	$scope.vm.user.gender = $scope.gender;

	student.customPOST({student: $scope.vm.user, o_subjects: $scope.vm.o_subjects}, "update", {}).then(function(data){
	  if(data.success) {
	    if($routeParams.location){
	      $location.path("classes/"+$routeParams.class_id+"/manage_class").replace();
	    }else{
	      $location.path("/students/"+$scope.student_id+"/show").replace();
	    }
	  }else {
	  }
	  $scope.dataLoading = true;
	});
      }
    };
    //end of edit path

    if($location.path() === "/students/" + $routeParams.student_id + "/pay_fee"){
      $scope.student_id = $routeParams.student_id;
      $scope.dataLoading = false;
      $scope.requestLoading = true;
      
      $scope.fee_amount = 0;
      $scope.tax_amount = 0;
      $scope.total_amount = 0;
      $scope.maxFee = 0;
      
      var student = Restangular.one("students", $routeParams.student_id);
      $scope.vm = {};
      $scope.vm.payment_type = 'cash'
      
      var getPayInfo = function() {
	student.customGET("get_fee_info").then(function(data) {
	  if(data.success) {
	    $scope.student_name = data.name;
	    $scope.mobile = data.mobile;
	    $scope.p_mobile = data.p_mobile;
	    $scope.classes = data.jkci_classes;
	    $scope.batch = data.batch;
	    $scope.enable_tax = data.enable_tax;
	    $scope.tax = data.service_tax;
	  } else {
	    lazyFlash.warning(data.message);
	    $location.path("/students/"+$scope.student_id+"/show").replace();
	  }
	  $scope.requestLoading = false;
	});
      };

      $scope.calculateMaxFee = function(klass){
	$scope.maxFee = _.where($scope.classes, {class_id: klass})[0].remaining_fee;
	$scope.vm.amount = '';
      };

      $scope.calculateTax = function(amount) {
	if(amount > 0){
	  $scope.tax_amount = (amount*($scope.tax / 100)).toFixed(2);
	  $scope.fee_amount = amount - $scope.tax_amount;
	  $scope.total_amount = amount;
	}else{
	  $scope.fee_amount = 0;
	  $scope.tax_amount = 0;
	  $scope.total_amount = 0;
	}

      }

      $scope.payFee = function() {
	$scope.dataLoading = true;

	student.customPOST({student_fee: $scope.vm}, "paid_student_fee", {}).then(function(data) {
	  if(data.success) {
	    lazyFlash.success(data.message);
	    $location.path("/accounts/students/"+$scope.student_id+"/fee_receipt/"+data.receipt_id).replace();
	  } else {
	    if(data.valid_password) {
	      lazyFlash.warning(data.message);
	      $location.path("/students/"+$scope.student_id+"/show").replace();
	    }else{
	      Flash.clear();
	      Flash.create('warning', data.message, 0, {}, true);
	      $scope.vm.password="";
	    }
	  }
	  $scope.dataLoading = false;
	});
      }
      
      getPayInfo();
      
    };
    //end of pay fee

    if($location.path() === "/students/" + $routeParams.student_id + "/pay_other_fee"){
      $scope.student_id = $routeParams.student_id;
      $scope.dataLoading = false;
      $scope.requestLoading = true;
      
      $scope.fee_amount = 0;
      $scope.tax_amount = 0;
      $scope.total_amount = 0;
      $scope.maxFee = 0;
      
      var student = Restangular.one("students", $routeParams.student_id);
      $scope.vm = {};
      $scope.vm.payment_type = 'cash'
      $scope.vm.is_fee = false;
      
      var getPayInfo = function() {
	student.customGET("get_fee_info").then(function(data) {
	  if(data.success) {
	    $scope.student_name = data.name;
	    $scope.mobile = data.mobile;
	    $scope.p_mobile = data.p_mobile;
	    $scope.classes = data.jkci_classes;
	    $scope.batch = data.batch;
	    $scope.enable_tax = data.enable_tax;
	    $scope.tax = data.service_tax;
	    $scope.reasons = data.payment_reasons;
	  } else {
	    lazyFlash.warning(data.message);
	    $location.path("/students/"+$scope.student_id+"/show").replace();
	  }
	  $scope.requestLoading = false;
	});
      };

      $scope.calculateMaxFee = function(klass){
	$scope.maxFee = _.where($scope.classes, {class_id: klass})[0].remaining_fee;
	$scope.vm.amount = '';
      };

      $scope.calculateTax = function(amount) {
	if(amount > 0){
	  $scope.tax_amount = (amount*($scope.tax / 100)).toFixed(2);
	  $scope.fee_amount = amount - $scope.tax_amount;
	  $scope.total_amount = amount;
	}else{
	  $scope.fee_amount = 0;
	  $scope.tax_amount = 0;
	  $scope.total_amount = 0;
	}

      }

      $scope.payFee = function() {
	$scope.dataLoading = true;

	student.customPOST({student_fee: $scope.vm}, "paid_student_fee", {}).then(function(data) {
	  if(data.success) {
	    lazyFlash.success(data.message);
	    $location.path("/accounts/students/"+$scope.student_id+"/fee_receipt/"+data.receipt_id).replace();
	  } else {
	    if(data.valid_password) {
	      lazyFlash.warning(data.message);
	      $location.path("/students/"+$scope.student_id+"/show").replace();
	    }else{
	      Flash.clear();
	      Flash.create('warning', data.message, 0, {}, true);
	      $scope.vm.password="";
	    }
	  }
	  $scope.dataLoading = false;
	});
      }
      
      getPayInfo();
      
    };
    //end of pay other fee

    if($location.path() === "/students/" + $routeParams.student_id + "/payment_info"){
      $scope.student_id = $routeParams.student_id;
      var student = Restangular.one("students", $routeParams.student_id);
      $scope.vm = {};
      $scope.vm.payment_type = 'cash'
      
      var getPayInfo = function() {
	student.customGET("get_payments_info").then(function(data) {
	  if(data.success) {
	    $scope.student_name = data.name;
	    $scope.mobile = data.mobile;
	    $scope.p_mobile = data.p_mobile;
	    $scope.batch = data.batch;
	    $scope.payments = data.payments;
	    $scope.totalStudents = $scope.payments.length;
	    $scope.totalFee = data.total_fee;
	    $scope.id = data.id;
	    $scope.remaining_fee = data.remaining_fee;
	    $scope.advances = data.advances;
	    $scope.hostel_payments = data.hostel_transations;
	  } else {
	    lazyFlash.warning(data.message);
	    $location.path("/students/"+$scope.student_id+"/show").replace();
	  }
	});
      };
      

      $scope.get_clearance = function() {
	$location.path("/students/"+$scope.student_id+"/get_clearance");
      };
      getPayInfo();
    };
    //end payment info

    if($location.path() === "/students/" + $routeParams.student_id + "/get_clearance"){
      var student = Restangular.one("students", $routeParams.student_id);
      $scope.clr_student = {}
      $scope.requestLoading = true;
      
      var loadStudent = function() {
	student.customGET("get_clearance").then(function(data){
	  if(data.success) {
	    $scope.clr_student = data.student;
	  } else {
	    lazyFlash.warning("Please pay Dues");
	    $location.path("/students/"+$routeParams.student_id+"/payment_info").replace();
	  }
	  $scope.requestLoading = false;
	});
      };

      
      loadStudent();
    };
    // end of get clearence
  }])

  .controller('StudentHostelAllotmentCtrl',['$scope', '$uibModalInstance', 'Restangular', 'student_id',
    function ($scope, $uibModalInstance, Restangular, student_id) {
      var student = Restangular.one("students", student_id);
      var hostels = Restangular.all("hostels");
      $scope.vm = {};
      $scope.vm.student = {};
      $scope.requestLoading = true;
      
      $scope.cancel = function () {
	$uibModalInstance.dismiss('cancel');
      };

      var getHostels = function() {
	hostels.customGET("" , {student_id: student_id}).then(function(data) {
	  if(data.success) {
	    $scope.hostels = data.hostels;
	    $scope.vm.student.hostel_id  = data.student_hostel;
	    $scope.dispalyDeallocate = data.student_hostel;
	    $scope.requestLoading = false;
	  }
	});
      };

      $scope.registerStudentHostel = function() {
	student.customPOST({student: $scope.vm.student}, "allocate_hostel").then(function(data) {
	  if(data.success) {
	    $scope.cancel();
	  }
	});
      };

      $scope.deallocateHostel = function() {
	student.customDELETE("deallocate_hostel").then(function(data) {
	  if(data.success) {
	    $scope.cancel();
	  }
	});
      }
      getHostels();
    }])

  .controller('StudentInfoCtrl',['$scope', '$uibModalInstance', 'Restangular', 'student_id',
    function ($scope, $uibModalInstance, Restangular, student_id) {
      var student = Restangular.one("students", student_id);
      $scope.requestLoading = true;
      $scope.absenteeRequestLoading = true;
      $scope.absentee = [];
      $scope.cancel = function () {
	$uibModalInstance.dismiss('cancel');
      };
      
      var getStudent = function() {
	student.get().then(function(data) {
	  if(data.success) {
	    $scope.student = data.body.student_show;
	    getAbsentee();
	  }
	  $scope.requestLoading = false;
	});
      };

      var getAbsentee = function() {
	student.customGET("get_absentee").then(function(data) {
	  if(data.success) {
	    $scope.absentee = data.absentee;
	    $scope.exams = data.exam_absentee;
	  }
	  $scope.absenteeRequestLoading = false;
	  //$scope.requestLoading = false;
	});
      }
      
      getStudent();
      
    }]);


