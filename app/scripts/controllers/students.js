'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('StudentsCtrl',['$rootScope', '$scope', 'Flash', '$location', 'Auth', 'Restangular', '$routeParams', 'Upload', '$window', '$cookieStore', function ($rootScope, $scope, Flash, $location, Auth, Restangular, $routeParams, Upload, $window, $cookieStore) {

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
    
    if($location.path() === '/students') {
      var students = Restangular.all("students");

      $scope.requestLoading = true;
      
      $scope.pagination = {
        current: 1
      };

      var getResultsPage = function(pageNumber) {
	$scope.requestLoading = true;
	students.getList({page: pageNumber, search: $scope.filterStudent}).then(function(data){
	  $scope.students = data[0];
	  $scope.totalStudents = data[1] || 0;
	  $scope.pagination = {
            current: pageNumber || 1
	  };
	  $scope.requestLoading = false;
	});
      };
      
      $scope.pageChanged = function(newPage) {
        getResultsPage(newPage);
      };

      getResultsPage(1);
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
	      $location.path("/students").replace();
	    }
	    
	  }else {
	    Flash.create('warning', data.message, 'alert-danger');
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
      $scope.selectedTimeZone = 'month';
      $scope.selectedGraphType = 'all';
      
      
      student.get().then(function(data){
	if(data.success) {
	  $scope.student = data.body.student;
	}
      });

      var loadGraph = function() {
	student.customGET("get_graph_data", {time_zone: $scope.selectedTimeZone, type: $scope.selectedGraphType}).then(function(data){
	  if(data.success){
	    $scope.labels = data.keys;
	    $scope.data = data.values;
	    $scope.series = data.header
	  }
	});
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
      
      loadGraph();
      
      $scope.onClick = function (points, evt) {
	console.log(points, evt);
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
	    $location.path("/students/"+$scope.student_id+"/show").replace();
	  }else {
	  }
	  $scope.dataLoading = true;
	});
      }
    };
    //end of edit path

    if($location.path() === "/students/" + $routeParams.student_id + "/pay_fee"){
      $scope.student_id = $routeParams.student_id;
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
	  } else {
	    Flash.create('warning', data.message, 'alert-danger');
	    $location.path("/students/"+$scope.student_id+"/show").replace();
	  }
	});
      };

      $scope.payFee = function() {
	student.customPOST({student_fee: $scope.vm}, "paid_student_fee", {}).then(function(data) {
	  if(data.success) {
	    Flash.create('success', data.message, 'alert-success');
	    $location.path("/students/"+$scope.student_id+"/show").replace();
	  } else {
	    if(data.valid_password) {
	      Flash.create('warning', data.message, 'alert-danger');
	      $location.path("/students/"+$scope.student_id+"/show").replace();
	    }else{
	      Flash.create('warning', data.message, 'alert-danger');
	      $scope.vm.password="";
	    }
	  }
	});
      }
      
      getPayInfo();
      
    };
    //end of pay fee

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
	  } else {
	    Flash.create('warning', data.message, 'alert-danger');
	    $location.path("/students/"+$scope.student_id+"/show").replace();
	  }
	});
      };

      getPayInfo();
    };
    //end payment info
    
    
  }]);


