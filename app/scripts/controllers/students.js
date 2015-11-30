'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('StudentsCtrl',['$rootScope', '$scope', 'Flash', '$location', 'Auth', 'Restangular', '$routeParams', 'Upload', '$window', function ($rootScope, $scope, Flash, $location, Auth, Restangular, $routeParams, Upload, $window) {

    if(!Auth.isAuthenticated()){
      $location.path('/user/sign_in');
      return true;
    };
    
    if($location.path() === '/students') {
      var students = Restangular.all("students");
      students.getList().then(function(data){
	$scope.students = data;
      });
    };

    if($location.path() === '/students/new' || $location.path() === "/classes/" + $routeParams.class_id + "/students/new"){
      var students = Restangular.all("students");
      $scope.initl = 'Mr';
      $scope.gender = 'Male';
      $scope.optionalSubjects = [];
      $scope.classStudents = !_.isUndefined($routeParams.class_id);
      $scope.vm = {};

      students.customGET("new", {class_id: $routeParams.class_id}).then(function(data){
	$scope.standards = data.standards;
	$scope.batches = data.batches;
	if($scope.classStudents){
	  $scope.oSubjects= data.subjects;
	}
      });
      
      $scope.selectOptionalSubject = function(){
	Restangular.one("standards", $scope.vm.user.standard_id).customGET("optional_subjects").then(function(data){
	  $scope.oSubjects= data.subjects;
	})
      }
      
      $scope.registerStudent = function(){
	$scope.vm.user.o_subjects = $scope.optionalSubjects;
	$scope.vm.user.initl = $scope.initl;
	$scope.vm.user.gender = $scope.gender;
	if($scope.classStudents){
	  $scope.vm.user.standard_id = $scope.standards[0].id;
	}
	students.post($scope.vm.user).then(function(data) {
	  if(data.success) {
	    $location.path("/students");
	  }else {
	    Flash.create('warning', data.message, 'alert-danger');
	  }
	})
      }  
    };
    // end of new path

    if($location.path() === "/students/" + $routeParams.student_id + "/show"){
      var student = Restangular.one("students", $routeParams.student_id);
      student.get().then(function(data){
	if(data.success) {
	  $scope.student = data.body.student;
	}
      });
    };
    // end of show path
    
    if($location.path() === "/students/" + $routeParams.student_id + "/edit"){
      $scope.student_id = $routeParams.student_id;
      var student = Restangular.one("students", $routeParams.student_id);
      $scope.vm = {};

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
	  console.log($scope.vm.user);
	  //$scope.optionalSubjects = data.student.
	}
      });

      $scope.registerStudent = function() {
	$scope.vm.o_subjects = $scope.optionalSubjects;
	$scope.vm.user.initl = $scope.initl;
	$scope.vm.user.gender = $scope.gender;

	student.customPOST({student: $scope.vm.user, o_subjects: $scope.vm.o_subjects}, "update", {}).then(function(data){
	  if(data.success) {
	    $location.path("/students/"+$scope.student_id+"/show");
	  }else {
	  }
	});
      }
    };
    //end of edit path
    
  }]);


