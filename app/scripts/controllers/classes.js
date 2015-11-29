'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('ClassesCtrl',['$rootScope', '$scope', 'Flash', '$location', 'Auth', 'Restangular', '$routeParams', 'Upload', '$window', function ($rootScope, $scope, Flash, $location, Auth, Restangular, $routeParams, Upload, $window) {

    var message = '<strong>Well done!</strong> You successfully read this important alert message.';

    if(!Auth.isAuthenticated()){
      $location.path('/user/sign_in');
      return true;
    };
    
    
    if($location.path() === "/classes/"+$routeParams.class_id) {
      var jkci_classes = Restangular.one("jkci_classes", $routeParams.class_id);
      $scope.class_id = $routeParams.class_id;
      jkci_classes.get().then(function(data){
	if(data.success) {
	  $scope.class = data.jkci_class;
	} else {
	  $location.path("#/admin_desk");
	}
      });

      $scope.toggleClassAbsentSms = function() {
	jkci_classes.customGET("toggle_class_sms", {value: $scope.class.enable_class_sms}).then(function(data){
	  if(data.success) {
	  }else {
	    $scope.class.enable_class_sms = !$scope.class.enable_class_sms;
	  }
	});
      }

      $scope.toggleExamClassSms = function() {
	jkci_classes.customGET("toggle_exam_sms", {value: $scope.class.enable_exam_sms}).then(function(data){
	  if(data.success) {
	  }else {
	    $scope.class.enable_exam_sms = !$scope.class.enable_exam_sms;
	  }
	});
      }
    };
    // end of class show if path

    if($location.path() === "/classes/"+$routeParams.class_id+"/assign_students") {
      var jkci_classes = Restangular.one("jkci_classes", $routeParams.class_id);
      $scope.studentList = [];
      $scope.class_id = $routeParams.class_id;
      
      jkci_classes.customGET("/assign_students").then(function(data){
	if(data.success) {
	  $scope.remainingStudents = data.students;
	}else {
	  $location.path("/classes/"+$routeParams.class_id);
	}
      });

      $scope.saveStudentList = function(){
	jkci_classes.customPOST({students_ids: $scope.studentList}, "manage_students").then(function(data){
	  if(data.success) {
	    $location.path("/classes/"+$routeParams.class_id);
	  } else {
	    Flash.create('warning', "Please try again", 'alert-danger');
	  }
	});
      }
    };
    // end of class assign student if path
    
  }]);


