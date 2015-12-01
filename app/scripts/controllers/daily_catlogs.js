'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('DailyCatlogsCtrl',['$rootScope', '$scope', 'Flash', '$location', 'Auth', 'Restangular', '$routeParams', 'Upload', '$window', function ($rootScope, $scope, Flash, $location, Auth, Restangular, $routeParams, Upload, $window) {

    var message = '<strong>Well done!</strong> You successfully read this important alert message.';
    
    if(!Auth.isAuthenticated()){
      $location.path('/user/sign_in');
      return true;
    };
    
    if($location.path() === "/daily_catlogs") {
      var dtps = Restangular.all("daily_teachs");
      dtps.getList().then(function(data){
	
      });
    }

    if($location.path() === "/classes/"+$routeParams.class_id+"/daily_catlogs/new") {
      var jkci_classes = Restangular.one("jkci_classes", $routeParams.class_id);
      $scope.isOpen = false; //for calender 
      $scope.selectedPoints = [];

      $scope.openCalendar = function(e) {
        e.preventDefault();
        e.stopPropagation();
        $scope.isOpen = true;
      };
      
      jkci_classes.customGET('get_exam_info').then(function(data) {
	$scope.class_name = data.data.class_exam_data.class_name;
	$scope.divisions = data.data.class_exam_data.sub_classes;
	$scope.subjects = data.data.class_exam_data.subjects;
      });

      $scope.getChapters = function(){
	var subject_id = $scope.vm.daily_teachs.subject_id;
	jkci_classes.customGET("get_chapters", {subject_id: subject_id}).then(function(data){
	  if(data.success) {
	    $scope.chapters = data.chapters;
	  }else {
	  }
	});
      }
    };

    $scope.getChaptersPoints = function(){
      var chapter_id = $scope.vm.daily_teachs.chapter_id;
      Restangular.one("chapters", chapter_id).customGET('get_points').then(function(data){
	if(data.success) {
	  $scope.points = data.points;
	}else {
	}
      });
    };

    $scope.registorDailyTeaches = function(){
      $scope.vm.daily_teachs.sub_classes = _.pluck($scope.selectedDivisions, "id").join(',');
      $scope.vm.daily_teachs.chapters_point_id = $scope.selectedPoints.join(',');
      jkci_classes.customPOST({daily_teaching_point: $scope.vm.daily_teachs}, "daily_teachs").then(function(data){
	if(data.success) {
	  $location.path("/classes/"+data.class_id);
	}else {
	}
      });
    }
	
        
    
  }]);

