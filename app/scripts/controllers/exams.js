'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('ExamsCtrl',['$rootScope', '$scope', 'Flash', '$location', 'Auth', 'Restangular', '$routeParams', 'Upload', '$window', function ($rootScope, $scope, Flash, $location, Auth, Restangular, $routeParams, Upload, $window) {

    var message = '<strong>Well done!</strong> You successfully read this important alert message.';

    if(!Auth.isAuthenticated()){
      $location.path('/user/sign_in');
      return true;
    };
    
    if($location.path() === '/exams') {
      var exams = Restangular.all("exams");
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
    

    if($location.path() === "/classes/"+$routeParams.class_id+"/exams/"+ $routeParams.exam_id+"/show") {
      $scope.requestLoading = false;
      $scope.class_id = $routeParams.class_id;
      var jkci_classes = Restangular.all("jkci_classes");
      $scope.uploadingFile = false;
      $scope.uploadingMessage = "Uploading";
      $scope.uploadMeaasgeClass = "alert-warning";
      jkci_classes.customGET("/"+$routeParams.class_id+"/exams/"+$routeParams.exam_id).then(function(data){
	$scope.exam = data.exam;
      });
      
      $scope.$watch('file', function(newVal){
	if(newVal){
	  $scope.uploadingFile = false;
	  $scope.fileName  = newVal.name;
	}
      });

      $scope.submit = function() {
	if ($scope.file) {
	  $scope.uploadingFile = true;
	  $scope.uploadMeaasgeClass = "alert-warning";
	  $scope.uploadingMessage = "Uploading";
          $scope.upload($scope.file);
	}
      };

      $scope.verifyExam = function(exam) {
	if($window.confirm('Are you sure?')){
	  $scope.requestLoading = true;
	  jkci_classes.customGET("/"+$routeParams.class_id+"/exams/"+$routeParams.exam_id+"/verify_exam").then(function(data){
	    $scope.requestLoading = false;
	    if(data.success) {
	      $scope.exam.create_verification = true;
	    }
	  });
	}
      };

      $scope.conductExam = function(exam) {	
	if($window.confirm('Are you sure?')){
	  $scope.requestLoading = true;
	  jkci_classes.customGET("/"+$routeParams.class_id+"/exams/"+$routeParams.exam_id+"/exam_conducted").then(function(data){
	    $scope.requestLoading = false;
	    if(data.success) {
	      $scope.exam.is_completed = true;
	    }
	  });
	}
      };

      $scope.deleteExam = function(exam){
	$scope.exam.verify_result = !$scope.exam.verify_result;
      };

      $scope.editExam = function(exam){

      };
      
      
      // upload on file select or drop
      $scope.upload = function (file) {
	$scope.requestLoading = true;
        Upload.upload({
          url: "api/jkci_classes/" + $routeParams.class_id + "/exams/" + $routeParams.exam_id + "/upload_paper",
          data: {file: file, 'exam_id': $routeParams.exam_id}
        }).then(function (resp) {
	  $scope.requestLoading = false;
	  if(resp.data.success) {
	    $scope.uploadMeaasgeClass = "alert-success";
	    $scope.uploadingMessage = "Completed Successfully";
	  }else {
	    $scope.uploadMeaasgeClass = "alert-danger";
	    $scope.uploadingMessage = resp.data.message;
	  }
          console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        }, function (resp) {
	  $scope.requestLoading = false;
	  $scope.uploadingFile = false;
        }, function (evt) {
	  $scope.requestLoading = false;
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);

        });
      };
    }
    
    
  }]);

