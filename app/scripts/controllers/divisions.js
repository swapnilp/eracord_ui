'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('DivisionsCtrl',['$rootScope', '$scope', 'Flash', '$location', 'Auth', 'Restangular', '$routeParams', 'Upload', '$window', function ($rootScope, $scope, Flash, $location, Auth, Restangular, $routeParams, Upload, $window) {
    
    var message = '<strong>Well done!</strong> You successfully read this important alert message.';
    
    if(!Auth.isAuthenticated()){
      $location.path('/user/sign_in');
      return true;
    };

    if($location.path() === "/classes/"+$routeParams.class_id+"/divisions/new") {
      var jkci_classes = Restangular.one("jkci_classes", $routeParams.class_id);
      $scope.classId = $routeParams.class_id;
      jkci_classes.get().then(function(data){
	$scope.classes = data.jkci_class;
      });

      $scope.registerDivision = function(){
	jkci_classes.customPOST({sub_class: $scope.vm.sub_class}, "sub_classes").then(function(data) {
	  if(data.success) {
	    $location.path("/classes/"+$scope.classId).replace();
	  }else {
	    
	  }
	});
      }
      
    };

    if($location.path() === "/classes/"+$routeParams.class_id+"/divisions/"+$routeParams.division_id) {
      $scope.classId = $routeParams.class_id;
      $scope.divisionId = $routeParams.division_id;
      var jkci_classes = Restangular.one("jkci_classes", $routeParams.class_id);
      
      jkci_classes.one("sub_classes", $scope.divisionId).get().then(function(data) {
	if(data.success) {
	  $scope.division = data.sub_class;
	}else {
	}
      });

      $scope.deleteDivision = function() {
	jkci_classes.one("sub_classes", $scope.divisionId).remove().then(function(data) {
	 if(data.success) {
	   $location.path("/classes/"+$routeParams.class_id).replace();
	 }else {
	 } 
	});
      }
    };

    if($location.path() === "/classes/"+$routeParams.class_id+"/divisions/"+$routeParams.division_id+"/assign_students") {
      $scope.divisionId = $routeParams.division_id;
      var jkci_classes = Restangular.one("jkci_classes", $routeParams.class_id);
      $scope.studentList = [];
      $scope.class_id = $routeParams.class_id;
      
      jkci_classes.one("sub_classes", $scope.divisionId).customGET("remaining_students").then(function(data){
	if(data.success) {
	  $scope.remainingStudents = data.students;
	}else {
	  $location.path("/classes/"+$routeParams.class_id);
	}
      });

      $scope.saveStudentList = function(){
	jkci_classes.one("sub_classes", $scope.divisionId).customPOST({students: $scope.studentList.join(',')}, "add_students").then(function(data){
	  if(data.success) {
	    $location.path("/classes/"+$routeParams.class_id+"/divisions/"+$scope.divisionId).replace();
	  } else {
	    Flash.create('warning', "Please try again", 'alert-danger');
	  }
	});
      };
    };
    // end of class assign student if path
  }]);
