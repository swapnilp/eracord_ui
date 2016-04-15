'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('ClassesCtrl',['$rootScope', '$scope', 'Flash', '$location', 'Auth', 'Restangular', '$routeParams', 'Upload', '$window', '$route', '$cookieStore', function ($rootScope, $scope, Flash, $location, Auth, Restangular, $routeParams, Upload, $window, $route, $cookieStore) {


    if(!Auth.isAuthenticated()){
      $location.path('/user/sign_in');
      return true;
    }
    var jkci_classes;

    if($location.path() === "/classes/"+$routeParams.class_id) {
      jkci_classes = Restangular.one("jkci_classes", $routeParams.class_id);
      $scope.class_id = $routeParams.class_id;
      $scope.classExamsTab = $scope.classDtpTab = $scope.classDivisionTab = $scope.classNotificationTab = $scope.classStudentTab= $scope.classCatlogTab = false;
      $scope.token = $cookieStore.get('currentUser').token;

      var loadTabs = function(selectTab){
	if(selectTab === 'exams') {
	  $scope.classExamsTab = true;
	} else if(selectTab === 'daily_teaches') {
	  $scope.classDtpTab = true;
	} else if(selectTab === 'notifications') {
	  $scope.classNotificationTab = true;
	} else if (selectTab === 'students'){
	  $scope.classStudentTab = true;
	} else {
	  $scope.classCatlogTab = true;
	}
      };

      $scope.updateTabParams = function(tabName){
	$route.updateParams({ tab: tabName, page: null});
      };

      jkci_classes.get().then(function(data){
	if(data.success) {
	  $scope.has_manage_class = data.has_manage_class;
	  $scope.class = data.jkci_class;
	  $scope.class.self_organisation = data.self_organisation;
	  loadTabs($routeParams.tab);
	} else {
	  $location.path("/admin_desk").replace();
	}
      }, function(res){
	$location.path("/admin_desk").replace();
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
	    $location.path("/classes/"+$routeParams.class_id+"/manage_class").replace();
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
	      $location.path("/classes/"+$routeParams.class_id+"/manage_class").replace();
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
	  $location.path("/classes/"+$routeParams.class_id);
	}
      });
      
      $scope.getStudents = function(){
	if($scope.withStudent){
	  jkci_classes.customGET('students', {withoutPage: true}).then(function(data){
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
	  jkci_classes.customPOST({student_list: $scope.studentList, standard_id: $scope.standard_id}, 'upgrade_batch', {}).
	    then(function(data){
	      if(data.success) {
		if(data.is_same_organisation) {
		  $location.path("/classes/"+data.id).replace();
		}else {
		  $location.path("/admin_desk").replace();
		}
	      }
	    });
	}
      }
      
    }

    //end of manage roll number

    if($location.path() === "/classes/"+$routeParams.class_id+"/manage_class") {
      $scope.class_id = $routeParams.class_id;
      jkci_classes = Restangular.one("jkci_classes", $scope.class_id);
      $scope.remainingDuplicateCount = 0;
      $scope.dataLoading = false;
      
      if($routeParams.verify) {
	$scope.classStudentVerificationTab = true;
      }
      
      jkci_classes.get().then(function(data){
	if(data.success) {
	  $scope.jk_class = data.jkci_class;
	} else {
	  $location.path("/admin_desk");
	}
      });

      $scope.changeDuplicateRemaining = function(remainingDuplicateCount) {
	$scope.remainingDuplicateCount = remainingDuplicateCount;
      };

      $scope.recheckDuplicateStudent = function() {
	$scope.dataLoading = true;
	jkci_classes.customPOST({},"recheck_duplicate_student", {}).then(function(data) {
	  if(data.success) {
	    $scope.theDirFn();
	  }
	  $scope.dataLoading = false;
	});
      };

      $scope.dirRecheckStudents = function(theDirFn) {
	$scope.theDirFn = theDirFn;
      }

      $scope.verifyDuplicateStudent = function() {
	$scope.dataLoading = true;
	jkci_classes.customPOST({},"verify_students", {}).then(function(data) {
	  if(data.success) {
	    $location.path("/classes/"+$routeParams.class_id).replace();
	  }
	  $scope.dataLoading = false;
	});
      };
    }
    //end of manage Class
    
  }]);


