'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('ExamsCtrl',['$scope', 'Flash', '$location', 'Auth', 'Restangular', '$routeParams', 'Upload', '$window', function ( $scope, Flash, $location, Auth, Restangular, $routeParams, Upload, $window) {

    var jkci_classes;
    var jkci_class;
    if(!Auth.isAuthenticated()){
      $location.path('/user/sign_in').replace();
      return true;
    }

    if($location.path() === '/exams') {
      var exams = Restangular.all("exams");
      $scope.totalExams = 0;
      $scope.pagination = {current: 1};
      $scope.showFilter = true;
      $scope.filterExam = {};

      var getFilterData = function() {
	exams.customGET('get_filter_data').then(function(data){
	  if(data.success) {
	    $scope.standards = data.standards;
	    $scope.batches = data.batches;
	  }
	});
      };
      
      var getResultsPage = function(pageNumber) {
	exams.getList({page: pageNumber, filter: $scope.filterExam}).then(function(data){
	  $scope.exams = data[0];
	  $scope.totalExams = data[1];
	  $scope.length = data.length;
	});
      };
      
      $scope.pageChanged = function(newPage) {
        getResultsPage(newPage);
      };
      getFilterData();
      getResultsPage(1);
    }
    
    if($location.path() === "/classes/"+$routeParams.class_id+"/exams/new") {
      jkci_classes = Restangular.all("jkci_classes");
      $scope.isOpen = false; //for calender 
      $scope.isGroup = $routeParams.isGroup || false;
      
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
	if(!$scope.isGroup){
	  if(_.size($scope.selectedSubject) === 0){
	    Flash.create('warning', "Subject must be present", 'alert-danger');
	    return true;
	  }
	  
	  if(_.size($scope.selectedExamType) === 0){
	    Flash.create('warning', "Subject Type must be present", 'alert-danger');
	    return true;
	  }
	  
	  $scope.vm.subject_id = $scope.selectedSubject[0].id;
	  $scope.vm.exam_type = $scope.selectedExamType[0].name;
	}
	
	$scope.vm.sub_classes = _.pluck($scope.selectedDivisions, "id").join(',');
	$scope.vm.jkci_class_id = $routeParams.class_id;
	$scope.vm.is_group = $scope.isGroup;
	jkci_classes.customPOST({exam: $scope.vm}, "/"+$routeParams.class_id+"/exams", {}).then(function(data){
	  
	  if(data.success) {
	    Flash.create('success', "Exam has been created", 'alert-success');
	    $location.path("/classes/"+$routeParams.class_id+"/exams/"+data.id+"/show").replace();
	  }else {
	    Flash.create('warning', "Something went wrong", 'alert-warning');
	  }
	});
      };
    }

    if($location.path() ===  "/classes/"+$routeParams.class_id+"/exams/"+$routeParams.exam_id+"/new_grouped_exams") {
      jkci_classes = Restangular.one("jkci_classes", $routeParams.class_id);
      $scope.isOpen = false; //for calender 
      $scope.isGroup = false;
      $scope.inGroup = true;
      $scope.classId = $routeParams.class_id;
      $scope.parentExamId = $routeParams.exam_id;

      
      jkci_classes.one("exams", $routeParams.exam_id).customGET("get_exam_info").then(function(data){
	if(data.success){
	  $scope.class_name = data.data.group_exam_data.class_name;
	  $scope.divisions = data.data.group_exam_data.sub_classes;
	  $scope.subjects = data.data.group_exam_data.subjects;
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
	}
	if(_.size($scope.selectedExamType) === 0){
	  Flash.create('warning', "Subject Type must be present", 'alert-danger');
	  return true;
	}
	$scope.vm.subject_id = $scope.selectedSubject[0].id;
	$scope.vm.exam_type = $scope.selectedExamType[0].name;
	$scope.vm.sub_classes = _.pluck($scope.selectedDivisions, "id").join(',');
	$scope.vm.jkci_class_id = $routeParams.class_id;
	$scope.vm.ancestry = $routeParams.exam_id;
	jkci_classes.one("exams", $routeParams.exam_id).customPOST({exam: $scope.vm}, "exams", {}).then(function(data){
	  if(data.success) {
	    Flash.create('success', "Exam has been created", 'alert-success');
	    $location.path("/classes/"+$routeParams.class_id+"/exams/"+data.id+"/show").replace();
	  }else {
	    Flash.create('warning', "Something went wrong", 'alert-warning');
	  }
	});
      };
    }
    // end of new grouped exams

    if($location.path() === "/classes/"+$routeParams.class_id+"/exams/"+ $routeParams.exam_id+"/show") {
      $scope.requestLoading = false;
      $scope.class_id = $routeParams.class_id;
      $scope.file = null;
      $scope.fileName = "";
      
      jkci_classes = Restangular.all("jkci_classes");
      $scope.uploadingFile = false;
      $scope.uploadingMessage = "Uploading";
      $scope.uploadMeaasgeClass = "alert-warning";
      jkci_classes.customGET("/"+$routeParams.class_id+"/exams/"+$routeParams.exam_id).then(function(data){
	$scope.exam = data.exam;
      });
      
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
	//$scope.exam.verify_result = !$scope.exam.verify_result;
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
	    $scope.fileName = "";
	    $scope.file = null;
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
          //var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        });
      };
    }
    //end of show path

    if($location.path() === "/classes/"+$routeParams.class_id+"/exams/"+ $routeParams.exam_id+"/manage_points") {
      $scope.requestLoading = false;
      $scope.selectedChapters = [];
      $scope.selectedPoints = [];
      $scope.chaptersPoints = [];
      $scope.class_id = $routeParams.class_id;
      $scope.examId = $routeParams.exam_id;
      jkci_class = Restangular.one("jkci_classes", $scope.class_id);
      
      jkci_class.one("exams", $scope.examId).customGET("manage_points").then(function(data){
	if(data.success) {
	  $scope.chapters = data.chapters;
	  $scope.selectedChapters = data.selected_chapters;
	  $scope.chaptersPoints = data.points;
	  $scope.selectedPoints = data.selected_points;
	}else{
	}
      });
      
      
      $scope.getPoints = function(){
	if($scope.selectedChapters.length > 0){
	  jkci_class.one("exams", $scope.examId).customGET("get_chapters_points", {chapter_ids: ""+$scope.selectedChapters}).then(function(data){
	    if(data.success) {
	      $scope.chaptersPoints = data.points;
	    }else{
	    }
	  });
	}else{
	  $scope.chaptersPoints = [];
	  $scope.selectedPoints = [];
	}
      };
      
      $scope.saveExamPoints = function() {
	if($scope.selectedPoints.length > 0){
	  jkci_class.one("exams", $scope.examId).customPOST({point_ids: ""+$scope.selectedPoints}, "save_exam_points", {}).then(function(data){
	    if(data.success) {
	      $location.path("/classes/"+$scope.class_id+"/exams/"+$scope.examId+"/show").replace();
	    }else{
	    }
	  });
	}
      };
    }
    //end of manage_points path

    if($location.path() === "/classes/"+$routeParams.class_id+"/exams/"+ $routeParams.exam_id+"/edit") {
      jkci_classes = Restangular.one("jkci_classes", $routeParams.class_id);
      $scope.isOpen = false; //for calender 
      //$scope.isGroup = $routeParams.isGroup || false;

      $scope.openCalendar = function(e) {
        e.preventDefault();
        e.stopPropagation();
        $scope.isOpen = true;
      };

      jkci_classes.one("exams", $routeParams.exam_id).customGET("edit").then(function(data){
	if(data.success){
	  $scope.vm = data.exam;
	  //$scope.class_name = data.data.class_exam_data.class_name;
	  $scope.divisions = data.sub_classes;
	  $scope.isGroup = data.exam.is_group;
	  $scope.subjects = data.subjects;
	  
	  $scope.examTypes= [{name: "Subjective", ticked: (data.exam.exam_type === "Subjective")}, {name: "Objective", ticked: (data.exam.exam_type !== "Subjective")}];
	}else{
	  $location.path("/admin_desk");
	}
      });

      $scope.createExam = function(){
	if(!$scope.isGroup){
	  if(_.size($scope.selectedSubject) === 0){
	    Flash.create('warning', "Subject must be present", 'alert-danger');
	    return true;
	  }
	  
	  if(_.size($scope.selectedExamType) === 0){
	    Flash.create('warning', "Subject Type must be present", 'alert-danger');
	    return true;
	  }
	  
	  $scope.vm.subject_id = $scope.selectedSubject[0].id;
	  $scope.vm.exam_type = $scope.selectedExamType[0].name;
	}
	
	$scope.vm.sub_classes = _.pluck($scope.selectedDivisions, "id").join(',');
	$scope.vm.jkci_class_id = $routeParams.class_id;
	$scope.vm.is_group = $scope.isGroup;
	jkci_classes.one("exams", $routeParams.exam_id).customPOST({exam: $scope.vm},"update").then(function(data){
	  if(data.success) {
	    $location.path("/classes/"+$routeParams.class_id+"/exams/"+data.id+"/show").replace();
	  }else {
	    Flash.create('warning', "Something went wrong", 'alert-warning');
	  }
	});
      };
    }
  }]);

