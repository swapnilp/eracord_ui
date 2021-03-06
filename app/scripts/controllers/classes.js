'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('ClassesCtrl',['$rootScope', '$scope', 'Flash', '$location', 'Auth', 'Restangular', '$routeParams', 'Upload', '$window', '$route', '$cookieStore', '$timeout', function ($rootScope, $scope, Flash, $location, Auth, Restangular, $routeParams, Upload, $window, $route, $cookieStore, $timeout) {


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
      $scope.requestLoading = true;
      $scope.status = {};
      $scope.status.isInfoOpen = false;

      $scope.$watch('activeTab', function() {
	if($scope.activeTab == undefined){
	  if($routeParams.tab == 'class_catlogs'){
	    $scope.activeTab = 0;
	  }else if($routeParams.tab == 'exams'){
	    $scope.activeTab = 2;
	  }else if($routeParams.tab == 'daily_teaches') {
	    $scope.activeTab = 3;
	  }else{
	    $scope.activeTab = 1;
	  }
	}else{
	  if($scope.activeTab === 0){
	    $scope.updateTabParams('class_catlogs'); 
	    $scope.classCatlogTab = true;
	  }else if($scope.activeTab === 1){
	    $scope.updateTabParams('students'); 
	    $scope.classStudentTab = true;
	  }else if($scope.activeTab === 2){
	    $scope.updateTabParams('exams'); 
	    $scope.classExamsTab = true;
	  }else if($scope.activeTab === 3){
	    $scope.updateTabParams('daily_teaches'); 
	    $scope.classDtpTab = true;
	  }
	}
      });

      $scope.updateTabParams = function(tabName){
	$route.updateParams({ tab: tabName, page: null});
      };

      jkci_classes.get().then(function(data){
	if(data.success) {
	  $scope.has_manage_class = data.has_manage_class;
	  $scope.class = data.jkci_class;
	  $scope.class.self_organisation = data.self_organisation;
	  $scope.requestLoading = false;
	} else {
	  $location.path("/admin_desk").replace();
	}
      }, function(res){
	$location.path("/admin_desk").replace();
      });
      
      
    }
    // end of class show if path

    if($location.path() === "/classes/"+$routeParams.class_id+"/manage_student_subjects") {
      jkci_classes = Restangular.one("jkci_classes", $routeParams.class_id);
      $scope.classId = $routeParams.class_id;
      $scope.requestLoading = true;
      $scope.dataLoading = false;
      jkci_classes.customGET("manage_student_subject").then(function(data){
	if(data.success) {
	  $scope.jk_class = data.jkci_class;
	  $scope.students = data.students;
	  $scope.subjects = data.subjects;
	}
	$scope.requestLoading = false;
      });

      $scope.saveStudentSubjects = function(){
	$scope.dataLoading = true;
	jkci_classes.customPOST({students: $scope.students}, "save_student_subjects").then(function(data){
	  if(data.success) {
	    $location.path("/classes/"+ $scope.classId+"/manage_class").replace();
	  } else {
	  }
	  $scope.dataLoading = false;
	});
      };
    }

    if($location.path() === "/classes/"+$routeParams.class_id+"/manage_student_rollnumber") {
      jkci_classes = Restangular.one("jkci_classes", $routeParams.class_id);
      $scope.classId = $routeParams.class_id;
      $scope.requestLoading = true;
      $scope.dataLoading = false;
      
      jkci_classes.customGET("manage_roll_number").then(function(data){
	if(data.success) {
	  $scope.jk_class = data.jkci_class;
	  $scope.students = data.students;
	  $scope.subjects = data.subjects;
	}
	$scope.requestLoading = false;
      });
      
      $scope.saveRollNumber = function() {
	$scope.dataLoading = true;
	var rollNumbers = _.map(_.compact(_.pluck($scope.students, 'roll_number')), function(roll){ return ""+ roll;});
	var uniqRollNumbers = _.uniq(rollNumbers);
	
	if(rollNumbers.length === uniqRollNumbers.length){
	  jkci_classes.customPOST({roll_number: $scope.students}, "save_roll_number", {}).then(function(data){
	    if(data.success) {
	      $location.path("/classes/"+$routeParams.class_id+"/manage_class").replace();
	    }else {
	    }
	    $scope.dataLoading = false;
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

      $scope.checkAllStudent = function() {
	_.each($scope.students, function(student){
	  student.checked = true;
	});
	$scope.studentList = _.pluck($scope.students, 'id');
      };

      $scope.uncheckAllStudent = function() {
	_.each($scope.students, function(student){
	  student.checked = false;
	});
      };
      
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
		  $location.path("/classes/"+data.class_id).replace();
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
      $scope.classLoading = true;
      
      if($routeParams.verify) {
	$scope.classStudentVerificationTab = true;
      }
      
      $scope.$watch('activeTab', function() {
	if($scope.activeTab == undefined){
	  $scope.activeTab = 0;
	}else{
	  if($scope.activeTab === 0){
	    $scope.classStudentVerificationTab = true;
	  }else if($scope.activeTab === 1){
	    $scope.classStudentTab = true;
	  }else if($scope.activeTab === 2){
	    $scope.classDivisionTab = true;
	  }else if($scope.activeTab === 3){
	    $scope.classTimeTableTab = true;
	  } else if($scope.activeTab === 4){
	    $scope.classNotificationTab = true;
	  }
	}
      });
      
      jkci_classes.get().then(function(data){
	if(data.success) {
	  $scope.jk_class = data.jkci_class;
	} else {
	  $location.path("/admin_desk");
	}
	$scope.classLoading = false;
      });

      $scope.changeDuplicateRemaining = function(remainingDuplicateCount) {
	$scope.remainingDuplicateCount = remainingDuplicateCount;
      };

      $scope.toggleClassAbsentSms = function() {
	jkci_classes.customGET("toggle_class_sms", {value: $scope.jk_class.enable_class_sms}).then(function(data){
	  if(data.success) {
	  }else {
	    $scope.jk_class.enable_class_sms = !$scope.jk_class.enable_class_sms;
	    $scope.catlogSmsError = true;
	    $timeout(function(){$scope.catlogSmsError = false;}, 5000);
	  }
	});
      };

      $scope.toggleExamClassSms = function() {
	jkci_classes.customGET("toggle_exam_sms", {value: $scope.jk_class.enable_exam_sms}).then(function(data){
	  if(data.success) {
	  }else {
	    $scope.jk_class.enable_exam_sms = !$scope.jk_class.enable_exam_sms;
	    $scope.examSmsError = true;
	    $timeout(function(){$scope.examSmsError = false;}, 5000);
	  }
	});
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
    
  }])


  .controller('ClassAssignStudentCtrl',['$scope', '$uibModalInstance', '$timeout',  'Restangular', 'class_id',
    function ($scope, $uibModalInstance, $timeout, Restangular, class_id)  {
      $scope.requestLoading = true;
      $scope.dataLoading = false;
      $scope.class_id = class_id;
      var jkci_classes = Restangular.one("jkci_classes", class_id);
      $scope.studentList = [];
      
      
      jkci_classes.customGET("/assign_students").then(function(data){
      	if(data.success) {
      	  $scope.remainingStudents = data.students;
      	}else {
	  $scope.cancel();
      	}
      	$scope.requestLoading = false;
      });
      
      $scope.selectAll = function() {
	_.map($scope.remainingStudents, function(student){
	  $timeout(function(){student.checked = true;}, 5); 
	});
      };

      $scope.unselectAll = function() {
	_.map($scope.remainingStudents, function(student){
	  $timeout(function(){student.checked = false;}, 5); 
	});
      };
      
      $scope.saveStudentList = function(){
      	$scope.dataLoading = true;
      	jkci_classes.customPOST({students_ids: $scope.studentList}, "manage_students").then(function(data){
      	  if(data.success) {
	    $uibModalInstance.dismiss('cancel');
      	  } else {
      	    Flash.create('warning', "Please try again", 0, {}, true);
      	  }
      	  $scope.dataLoading = false;
      	});
      };
      
      $scope.cancel = function () {
	$uibModalInstance.dismiss('cancel');
      };
    }])

  .controller('TimeTableClassModelCtrl',['$scope', '$filter',  '$uibModalInstance', '$timeout',  'Restangular', 'time_table_id', 
    'cwday', 'slot', 'subject_id', 'subjects', 'divisions', function ($scope, filter, $uibModalInstance, $timeout, Restangular, 
    time_table_id, cwday, slot, subject_id, subjects, divisions)  {
      $scope.days = {
	1: 'Monday',
	2: 'Tuesday',
	3: 'Wednesday',
	4: 'Thusday',
	5: 'Friday',
	6: 'Saturday',
	7: 'Sunday'
      };

      $scope.subjects = subjects;
      $scope.sub_classes = divisions;
      
      $scope.vm = {};
      $scope.vm.cwday = ""+cwday;
      $scope.vm.slot_type = "Class";
      $scope.vm.subject_id = subject_id;
      $scope.start_time = moment(slot+":00", "HH:mm").toDate();
      $scope.end_time = moment((slot+1)+":00", "HH:mm").toDate();

      $scope.registorTimeTableSlot = function() {
	$scope.dataLoading = true;
	$scope.vm.time_table_id = time_table_id;
	$scope.vm.start_time = filter('date')($scope.start_time, "HH:mm").replace(":", ".");
	$scope.vm.end_time = filter('date')($scope.end_time, "HH:mm").replace(":", ".");
	var millisecondsPerHour = 1000 * 60;
	$scope.vm.durations = Math.round(($scope.end_time - $scope.start_time)/millisecondsPerHour);
	if($scope.vm.slot_type !== 'Class') {
	  $scope.vm.subject_id = null;
	}
	var time_tables = Restangular.one("time_tables", time_table_id);
	
	time_tables.customPOST({time_table_class: $scope.vm}, "time_table_classes", {}).then(function(data) {
	  $uibModalInstance.close(data.slot);
	});
      };
      
      $scope.openCalendar = function(e) {
        e.preventDefault();
        e.stopPropagation();
        $scope.isOpen = true;
      };
      
      $scope.openEndCalendar = function(e) {
        e.preventDefault();
        e.stopPropagation();
        $scope.isOpenEndDate = true;
      };
      
      $scope.cancel = function () {
	$uibModalInstance.dismiss('cancel');
      };

      $scope.cancelTimeTableSlotManage = function () {
	$uibModalInstance.dismiss('cancel');
      };

      $scope.selectTeacher = function(teacher) {
	$scope.vm.teacher_id =  teacher.id;
	$scope.vm.teacher_name = teacher.name;
      };

      $scope.$watch('status.teacherOpen', function(){
	$scope.teacherLoading = true;
	var base_organisation = Restangular.all("organisations");
	base_organisation.customGET("teachers").then(function(data){
	  if(data.success){
	    $scope.teachers = data.teachers;
	  }
	  $scope.teacherLoading = false;
	});
      });
      
    }])

  .controller('ClassActivitiesCtrl',['$scope', '$uibModalInstance', 'Restangular', '$location', 'day', 'class_id',
    function ($scope, $uibModalInstance, Restangular, $location, day, class_id)  {
      $scope.requestLoading = true;
      $scope.day = moment(day, "DD-MM-YYYY");
      var jkci_classes = Restangular.one("jkci_classes", class_id);
      
      var get_activity =  function(given_day) {
	$scope.requestLoading = true;
	jkci_classes.customGET("get_activity", {date: given_day}).then(function(data) {
	  if(data.success) {
	    $scope.activities = data.activities;
	    $scope.class_name = data.class_name;
	  } else {
	    $scope.cancel();
	  }
	  $scope.requestLoading = false;
	});
      };

      $scope.next = function() {
	$scope.day = $scope.day.add(1, 'day');
	get_activity($scope.day.format("DD-MM-YYYY"));
      };

      $scope.openLink = function(url) {
	if(url){
	  $scope.cancel();
	  $location.path(""+url);
	}
      }

      $scope.previous = function() {
	$scope.day = $scope.day.subtract(1, 'day');	
	get_activity($scope.day.format("DD-MM-YYYY"));
      };
      
      get_activity($scope.day.format("DD-MM-YYYY"));
      
      $scope.cancel = function () {
	$uibModalInstance.dismiss('cancel');
      };
    }]);
