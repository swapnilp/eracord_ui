'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('DailyCatlogsCtrl',['$rootScope', '$scope', 'Flash', '$location', 'Auth', 'Restangular', '$routeParams', function ($rootScope, $scope, Flash, $location, Auth, Restangular, $routeParams) {

    var jkci_classes;
    
    if(!Auth.isAuthenticated()){
      $location.path('/user/sign_in');
      return true;
    }
    
    if($location.path() === "/classes/"+$routeParams.class_id+"/daily_catlogs/new") {
      jkci_classes = Restangular.one("jkci_classes", $routeParams.class_id);
      $scope.classId = $routeParams.class_id;
      $scope.isNew = true;
      $scope.isOpen = false; //for calender 
      $scope.selectedPoints = [];
      $scope.vm = {};
      $scope.vm.daily_teachs = {};
      var date = new Date();
      $scope.max_date = ""+ date.getFullYear()+"/"+(date.getMonth()+1)+"/"+ (date.getDate()+1);
      
      $scope.openCalendar = function(e) {
        e.preventDefault();
        e.stopPropagation();
        $scope.isOpen = true;
      };
      
      $scope.getChapters = function(){
	var subject_id = $scope.vm.daily_teachs.subject_id;
	jkci_classes.customGET("get_chapters", {subject_id: subject_id}).then(function(data){
	  if(data.success) {
	    $scope.chapters = data.chapters;
	  }else {
	  }
	});
      };
      
      jkci_classes.customGET('get_exam_info').then(function(data) {
	$scope.class_name = data.data.class_exam_data.class_name;
	$scope.divisions = data.data.class_exam_data.sub_classes;
	$scope.subjects = data.data.class_exam_data.subjects;
      });
      
      if($routeParams.subject_id) {
	$scope.vm.daily_teachs.subject_id = parseInt($routeParams.subject_id);
	$scope.getChapters();
      }
      
      if($routeParams.date) {
	if(new Date($routeParams.date) < new Date){
	  $scope.vm.daily_teachs.date = new Date($routeParams.date);
	} else {
	  $scope.vm.daily_teachs.date = new Date;
	}
      }

      $scope.getChaptersPoints = function(){
	var chapter_id = $scope.vm.daily_teachs.chapter_id;
	Restangular.one("chapters", chapter_id).customGET('get_points').then(function(data){
	  if(data.success) {
	    $scope.points = data.points;
	    $scope.selectedPoints = [];
	  }else {
	  }
	});
      };
      
      $scope.registorDailyTeaches = function(){
	$scope.vm.daily_teachs.sub_classes = _.pluck($scope.selectedDivisions, "id").join(',');
	$scope.vm.daily_teachs.chapters_point_id = $scope.selectedPoints.join(',');
	jkci_classes.customPOST({daily_teaching_point: $scope.vm.daily_teachs}, "daily_teachs").then(function(data){
	  if(data.success) {
	    $location.path("/classes/"+data.class_id).replace();
	  }else {
	  }
	});
      };
    }	

    if($location.path() === "/classes/"+$routeParams.class_id+"/daily_catlogs/"+$routeParams.dtp_id+"/show") {
      jkci_classes = Restangular.one("jkci_classes", $routeParams.class_id);
      $scope.class_id = $routeParams.class_id;
      
      jkci_classes.one("daily_teachs", $routeParams.dtp_id).get().then(function(data){
	$scope.daily_teache = data.daily_teaching_point;
      });
    }

    //end of show path
    
    if($location.path() === "/classes/"+$routeParams.class_id+"/daily_catlogs/"+$routeParams.dtp_id+"/edit") {
      $scope.classId = $routeParams.class_id;
      
      $scope.vm = {};
      $scope.selectedPoints = [];
      
      jkci_classes = Restangular.one("jkci_classes", $routeParams.class_id);
      
      jkci_classes.one("daily_teachs", $routeParams.dtp_id).customGET("edit").then(function(data){
	if(data.success) {
	  $scope.vm.daily_teachs = data.daily_teaching_point;
	  $scope.divisions = data.sub_classes;
	  $scope.chapters = data.chapters;
	  $scope.points = data.chapters_points;
	  $scope.selectedPoints = $scope.vm.daily_teachs.chapters_point_id;
	} else {
	  
	}
      });
      
      $scope.getChaptersPoints = function(){
	var chapter_id = $scope.vm.daily_teachs.chapter_id;
	Restangular.one("chapters", chapter_id).customGET('get_points').then(function(data){
	  if(data.success) {
	    $scope.points = data.points;
	    $scope.selectedPoints = [];
	  }else {
	  }
	});
      };
      
      $scope.registorDailyTeaches = function(){
	//$scope.vm.daily_teachs.sub_classes = _.pluck($scope.selectedDivisions, "id").join(',');
	$scope.vm.daily_teachs.chapters_point_id = $scope.selectedPoints.join(',');
	jkci_classes.one("daily_teachs", $routeParams.dtp_id).customPOST({daily_teaching_point: $scope.vm.daily_teachs}, "update").then(function(data){
	  if(data.success) {
	    $location.path("/classes/"+$scope.classId).replace();
	  }else {
	  }
	});
      };
    }
    
  }]);

