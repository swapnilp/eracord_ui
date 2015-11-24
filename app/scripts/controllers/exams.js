'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('ExamsCtrl',['$rootScope', '$scope', 'Flash', '$location', 'Auth', 'Restangular', '$routeParams', function ($rootScope, $scope, Flash, $location, Auth, Restangular, $routeParams) {

    var message = '<strong>Well done!</strong> You successfully read this important alert message.';

    if(!Auth.isAuthenticated()){
      $location.path('/user/sign_in');
      return true;
    };
    
    if($location.path() === '/exams') {
      var exams = Restangular.all("exams")
      exams.getList().then(function(data){
	$scope.exams = data;
      });
      
    };
    
    if($location.path() === "/classes/"+$routeParams.class_id+"/exams/new") {
      var jkci_classes = Restangular.all("jkci_classes");
      $scope.isOpen = false;
      jkci_classes.customGET(""+$routeParams.class_id+"/get_exam_info").then(function(data){
	if(data.success){
	  $scope.class_name = data.data.class_exam_data.class_name;
	  $scope.divisions = data.data.class_exam_data.sub_classes;
	  $scope.subjects = data.data.class_exam_data.subjects;
	  $scope.examTypes= [{name: "Subjective", ticked: true}, {name: "Objective"}];
	}else{
	  $location.path("/admin_desk");
	}
	
      });

      if($location.path() === "/classes/"+$routeParams.class_id+"/exams/"+ $routeParams.exam_id+"/show") {
      }

      $scope.openCalendar = function(e) {
        e.preventDefault();
        e.stopPropagation();
        $scope.isOpen = true;
      };
      
      $scope.createExam = function(){
	if(_.size($scope.selectedSubject) === 0){
	  Flash.create('warning', "Subject must be present", 'alert-danger');
	  return true;
	};
	if(_.size($scope.selectedExamType) === 0){
	  Flash.create('warning', "Subject Type must be present", 'alert-danger');
	  return true;
	}
	$scope.vm.subject_id = $scope.selectedSubject[0].id;
	$scope.vm.exam_type = $scope.selectedExamType[0].name;
	$scope.vm.sub_classes = _.pluck($scope.selectedDivisions, "id").join(',');
	$scope.vm.jkci_class_id = $routeParams.class_id;
	jkci_classes.customPOST({exam: $scope.vm}, "/"+$routeParams.class_id+"/exams", {}).then(function(data){
	  if(data.success) {
	    Flash.create('success', "Exam has been created", 'alert-success');
	    $location.path("/admin_desk");
	  }else {
	    Flash.create('warning', "Something went wrong", 'alert-warning');
	  }
	});
      };
    };
    

  }]);

