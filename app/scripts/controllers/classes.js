'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('ClassesCtrl',['$rootScope', '$scope', 'Flash', '$location', 'Auth', 'Restangular', '$routeParams', 'Upload', '$window', '$route', function ($rootScope, $scope, Flash, $location, Auth, Restangular, $routeParams, Upload, $window, $route) {


    if(!Auth.isAuthenticated()){
      $location.path('/user/sign_in');
      return true;
    }
    var jkci_classes;
    
    if($location.path() === "/classes/"+$routeParams.class_id) {
      jkci_classes = Restangular.one("jkci_classes", $routeParams.class_id);
      $scope.class_id = $routeParams.class_id;
      $scope.classExamsTab = $scope.classDtpTab = $scope.classDivisionTab = $scope.classNotificationTab = $scope.classStudentTab = false;

      var loadTabs = function(selectTab){
	if(selectTab === 'exams') {
	  $scope.classExamsTab = true;
	} else if(selectTab === 'daily_teaches') {
	  $scope.classDtpTab = true;
	} else if( selectTab === 'divisions' ) {
	  $scope.classDivisionTab = true;
	} else if(selectTab === 'notifications') {
	  $scope.classNotificationTab = true;
	} else {
	  $scope.classStudentTab = true;
	}
      };

      $scope.updateTabParams = function(tabName){
	$route.updateParams({ tab: tabName, page: null});
      };

      
      jkci_classes.get().then(function(data){
	if(data.success) {
	  $scope.class = data.jkci_class;
	  loadTabs($routeParams.tab);
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
      };

      $scope.toggleExamClassSms = function() {
	jkci_classes.customGET("toggle_exam_sms", {value: $scope.class.enable_exam_sms}).then(function(data){
	  if(data.success) {
	  }else {
	    $scope.class.enable_exam_sms = !$scope.class.enable_exam_sms;
	  }
	});
      };
    }
    // end of class show if path

    if($location.path() === "/classes/"+$routeParams.class_id+"/assign_students") {
      jkci_classes = Restangular.one("jkci_classes", $routeParams.class_id);
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
	    $location.path("/classes/"+$routeParams.class_id).replace();
	  } else {
	    Flash.create('warning', "Please try again", 'alert-danger');
	  }
	});
      };
    }
    // end of class assign student if path

    if($location.path() === "/classes/"+$routeParams.class_id+"/manage_student_subjects") {
      jkci_classes = Restangular.one("jkci_classes", $routeParams.class_id);
      $scope.classId = $routeParams.class_id;
      jkci_classes.customGET("manage_student_subject").then(function(data){
	if(data.success) {
	  $scope.jk_class = data.jkci_class;
	  $scope.students = data.students;
	  $scope.subjects = data.subjects;
	}
      });

      $scope.saveStudentSubjects = function(){
	jkci_classes.customPOST({students: $scope.students}, "save_student_subjects").then(function(data){
	  if(data.success) {
	    $location.path("/classes/"+ $scope.classId).replace();
	  } else {
	  }
	});
      };
    }

    if($location.path() === "/classes/"+$routeParams.class_id+"/manage_student_rollnumber") {
      jkci_classes = Restangular.one("jkci_classes", $routeParams.class_id);
      $scope.classId = $routeParams.class_id;
      jkci_classes.customGET("manage_roll_number").then(function(data){
	if(data.success) {
	  $scope.jk_class = data.jkci_class;
	  $scope.students = data.students;
	  $scope.subjects = data.subjects;
	}
      });
      
      $scope.saveRollNumber = function() {
	var rollNumbers = _.map(_.compact(_.pluck($scope.students, 'roll_number')), function(roll){ return ""+ roll;});
	var uniqRollNumbers = _.uniq(rollNumbers);

	if(rollNumbers.length === uniqRollNumbers.length){
	  jkci_classes.customPOST({roll_number: $scope.students}, "save_roll_number", {}).then(function(data){
	    if(data.success) {
	      $location.path("/classes/"+$scope.classId).replace();
	    }else {
	    }
	  });
	}else {
	}
      };
    }

    if($location.path() === "/classes/"+$routeParams.class_id+"/get_batch") {
      $scope.withStudent = false;
      $scope.students = [];
      $scope.studentList =[];
      
      jkci_classes = Restangular.one("jkci_classes", $routeParams.class_id);
      
      jkci_classes.customGET('get_batch').then(function(data){
	if(data.success) {
	  $scope.class = data.jkci_class;
	  $scope.standards = data.standards;
	} else {
	  $location.path("#/classes/"+$routeParams.class_id);
	}
      });
      
      $scope.getStudents = function(){
	if($scope.withStudent){
	  jkci_classes.customGET('students').then(function(data){
	    if(data.success) {
	      $scope.students = data.students;
	    }
	  });
	}else{
	  $scope.students = [];
	}
      };

      $scope.upgradeBatch = function(){
	if($scope.standard_id){
	  jkci_classes.customPOST({student_list: $scope.studentList, standard_id: $scope.standard_id}, 'upgrade_batch', {}).then(function(data){
	  });
	}
      }
      
    }

    //end of manage roll number

  }]);


