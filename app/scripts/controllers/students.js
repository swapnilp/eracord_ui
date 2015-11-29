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

    if($location.path() === '/students/new'){
      var students = Restangular.all("students");
      $scope.initl = 'Mr';
      $scope.gender = 'Male';
      $scope.optionalSubjects = [];

      students.customGET("new").then(function(data){
	$scope.standards = data.standards;
	$scope.batches = data.batches;
      });
      
      $scope.selectOptionalSubject = function(){
	Restangular.one("standards", $scope.vm.user.standard_id).customGET("optional_subjects").then(function(data){
	  $scope.oSubjects= data.subjects;
	})
      }
      
      $scope.registerStudent = function(){
	$scope.vm.user.o_subjects = $scope.optionalSubjects;
	students.post($scope.vm.user).then(function(data) {
	  if(data.success) {
	    $location.path("/students");
	  }else {
	    Flash.create('warning', data.message, 'alert-danger');
	  }
	})
      }
      
    }
    
    
    
    
  }]);


