'use strict';
var app;

app = angular.module('eracordUiApp.directives');

app.directive('classStudents', function(Restangular) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      classId: '@',
      classStudentsTab: '@',
      updateUrl: '&',
      isRemove: '@',
      showOptions: '@',
      hostUrl: '@'
    },
    templateUrl: 'views/students/index.html',
    controller: ['$scope', 'Restangular', 'Flash', '$location', '$window', '$routeParams', '$route', 'Upload', '$cookieStore', function(scope, Restangular, Flash, $location, $window, $routeParams, $route, Upload, $cookieStore){
      scope.cources = [];
      scope.showRollNumber = true;
      scope.isRollNumber = true;
      
      scope.studentLoaded = false;
      var jkci_classes = Restangular.one("jkci_classes", scope.classId);
      scope.token = $cookieStore.get('currentUser').token;

      scope.totalStudents = 0;
      
      scope.pagination = {
        current: $routeParams.page || 1
      };

      scope.selectUploadFile = function(newVal){
	if(newVal){
	  scope.file = newVal;
	  scope.uploadingFile = false;
	  scope.fileName  = newVal.name;
	}
      };

      scope.submit = function() {
	if (scope.file) {
	  scope.uploadingFile = true;
	  scope.uploadMeaasgeClass = "alert-warning";
	  scope.uploadingMessage = "Uploading";
          scope.upload(scope.file);
	}
      };


      scope.upload = function (file) {
	scope.requestLoading = true;
        Upload.upload({
          url: "api/jkci_classes/" + $routeParams.class_id + "/import_students_excel",
          data: {file: file, 'exam_id': $routeParams.exam_id}
        }).then(function (resp) {
	  scope.requestLoading = false;
	  if(resp.data.success) {
	    scope.uploadMeaasgeClass = "alert-success";
	    scope.uploadingMessage = "Completed Successfully";
	    scope.fileName = "";
	    scope.file = null;
	    $location.path("/classes/"+ $routeParams.class_id+"/manage_student_subjects").replace();
	  }else {
	    scope.uploadMeaasgeClass = "alert-danger";
	    scope.uploadingMessage = resp.data.message;
	  }
          console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        }, function (resp) {
	  scope.requestLoading = false;
	  scope.uploadMeaasgeClass = "alert-danger";
	  scope.uploadingMessage = "Please check file data and reupload it";
	  //scope.uploadingFile = false;
        }, function (evt) {
	  scope.requestLoading = false;
	  
          //var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        });
      };


      var getResultsPage = function(pageNumber) {
	jkci_classes.customGET("students", {page: pageNumber, search: scope.filterStudent}).then(function(data){
	  scope.students = data.students;
	  scope.totalStudents = data.count;
	});
      };
      
      scope.pageChanged = function(newPage) {
        getResultsPage(newPage);
      };
      

      scope.removeStudent = function(student) {
	if($window.confirm('Are you sure?')){
	  jkci_classes.one('students', student.id).remove().then(function(data){
	    if(data.success) {
	      scope.students = _.reject(scope.students, function(obj){return obj.id == student.id});
	    }else {
	    }
	  });
	}
      }
      
      scope.$watch('classStudentsTab', function(){
	if(scope.classStudentsTab === 'true') {
	  scope.updateUrl({tabName: 'students'});
	}
	if(scope.classStudentsTab === 'true' && scope.studentLoaded == false){
	  getResultsPage($routeParams.page || 1);
	  scope.studentLoaded = true;
	}
      });

    }]
  };
});

app.directive('classExams', function(Restangular) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      classId: '@',
      classExamsTab: '@',
       updateUrl: '&'
    },
    templateUrl: 'views/exams/index.html',
    controller: ['$scope', 'Restangular', 'Flash', '$location', '$window', '$routeParams', '$route', function(scope, Restangular, Flash, $location, $window, $routeParams, $route){

      scope.examsLoaded = false;
      var jkci_classes = Restangular.one("jkci_classes", scope.classId);
      scope.totalExams = 0;
      
      scope.pagination = {
        current: $routeParams.page || 1
      };
      
      var getResultsPage = function(pageNumber) {
	//$route.updateParams({ page: pageNumber});
	jkci_classes.customGET("exams" ,{page: pageNumber}).then(function(data){
	  scope.exams = data.body;
	  scope.totalExams = data.count;
	  scope.length = data.count;
	});

      };
      
      scope.pageChanged = function(newPage) {
        getResultsPage(newPage);
      };
      
      scope.isRemove = true;
      scope.loadClassExams = function() {
	
      };

      scope.$watch('classExamsTab', function(){
	if(scope.classExamsTab === 'true') {
	  scope.updateUrl({tabName: 'exams'});
	}
	if(scope.classExamsTab === 'true' && scope.examsLoaded == false){
	  getResultsPage($routeParams.page || 1);
	  scope.examsLoaded = true;
	}
      });

    }]
  };
});

app.directive('classDailyTeaches', function(Restangular) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      classId: '@',
      classDtpTab: '@',
      updateUrl: '&'
    },
    templateUrl: 'views/daily_catlogs/index.html',
    controller: ['$scope', 'Restangular', 'Flash', '$location', '$window', '$routeParams', '$route', function(scope, Restangular, Flash, $location, $window, $routeParams, $route){
      var dailyCatlogLoaded = false;
      var jkci_classes = Restangular.one("jkci_classes", scope.classId);
      scope.totalDtps = 0;
      scope.pagination = {
        current: $routeParams.page || 1
      };
      
      var getResultsPage = function(pageNumber) {
	jkci_classes.customGET('daily_teachs', {page: pageNumber}).then(function(data){
	  if(data.success) {
	    scope.dtps = data.daily_teaching_points;
	    scope.totalDtps = data.count;
	    //$route.updateParams({ page: pageNumber});
	  }else {
	  }
	});
      };
      
      scope.pageChanged = function(newPage) {
        getResultsPage(newPage);
      };
      
      scope.$watch('classDtpTab', function(){
	if(scope.classDtpTab === 'true') {
	  scope.updateUrl({tabName: 'daily_teaches'});
	  
	}
	
	if(scope.classDtpTab === 'true' && dailyCatlogLoaded === false) {

	  getResultsPage($routeParams.page || 1);
	  scope.dailyCatlogLoaded = true;
	}
	
      });
    }]
  }
});

app.directive('classNotifications', function(Restangular) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      classId: '@',
      classNotificationTab: '@',
      updateUrl: '&'
    },
    templateUrl: 'views/classes/notifications.html',
    controller: ['$scope', 'Restangular', 'Flash', '$location', '$window', '$routeParams', '$route', function(scope, Restangular, Flash, $location, $window, $routeParams, $route){
      var dailyCatlogLoaded = false;
      var jkci_classes = Restangular.one("jkci_classes", scope.classId);
      
      scope.totalNotifications = 0;
      scope.pagination = {
        current: $routeParams.page || 1
      };
      
      var getResultsPage = function(pageNumber) {
	jkci_classes.customGET('get_notifications', {page: pageNumber}).then(function(data){
	  if(data.success) {
	    scope.notifications = data.notifications;
	    scope.totalNotifications = data.count;
	  }else {
	  }
	});
      };
      
      scope.pageChanged = function(newPage) {
        getResultsPage(newPage);
      };
      
      
      scope.$watch('classNotificationTab', function(){
	if(scope.classNotificationTab === 'true') {
	  scope.updateUrl({tabName: 'notifications'});
	}
	
	if(scope.classNotificationTab === 'true' && dailyCatlogLoaded === false){
	  getResultsPage($routeParams.page || 1);
	  scope.dailyCatlogLoaded = true;
	}
      });
    }]
  }
});
// end of notifications

app.directive('classTimeTable', function(Restangular) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      classId: '@',
      classTimeTableTab: '@',
      updateUrl: '&',
      isRemove: '@',
      showOptions: '@'
    },
    templateUrl: 'views/time_tables/manage_time_table.html',
    controller: ['$scope', '$filter', 'Restangular', 'Flash', '$location', '$window', '$routeParams', '$route', function(scope, filter, Restangular, Flash, $location, $window, $routeParams, $route){
      
      scope.timeTableLoaded = false;
      var jkci_classes = Restangular.one("jkci_classes", scope.classId);


      scope.timeSlots = _.range(1,24);
      scope.selectedSlot = null;
      scope.showSlotForm = false;
      scope.vm = {};
      scope.isOpen = false;
      scope.isOpenEndDate = false
      scope.sub_classes = [];
      scope.days = {
	1: 'Monday',
	2: 'Tuesday',
	3: 'Wednesday',
	4: 'Thusday',
	5: 'Friday',
	6: 'Saturday'
      };
      scope.events = [];

      scope.openCalendar = function(e) {
        e.preventDefault();
        e.stopPropagation();
        scope.isOpen = true;
      };

      scope.openEndCalendar = function(e) {
        e.preventDefault();
        e.stopPropagation();
        scope.isOpenEndDate = true;
      };
      
      scope.deleteSlot = function(slot) {
	var time_table_rec = Restangular.one("time_tables", scope.time_table.id);
	time_table_rec.one("time_table_classes", slot.id).remove().then(function(data){
	  if(data.success) {
	    scope.events = _.reject(scope.events, function(d){ return d.id === slot.id; });
	    scope.selectedSlot = null;
	    calculateTimeSlotes();
	  } else {
	  }
	});
      };

      scope.editTimeTableSlot= function(selectedSlot) {
	scope.vm.id = selectedSlot.id;
	scope.vm.subject_id = selectedSlot.subject_id;
	scope.vm.cwday = ""+selectedSlot.cwday;
	scope.vm.slot_type = selectedSlot.slot_type;
	scope.vm.sub_class_id = selectedSlot.sub_class_id;
	scope.start_time = new Date("3/3/1016 "+ (""+selectedSlot.start_time).replace(".", ":"));
	scope.end_time = new Date("3/3/1016 "+ (""+selectedSlot.end_time).replace(".", ":"));
	scope.showSlotForm = true;
	scope.selectedSlot = null;
	calculateTimeSlotes();
      };
      
      
      scope.createTimeTableSlot = function() {
	scope.vm = {};
	scope.showSlotForm = true;
	scope.end_time = null;
	scope.start_time = null;
	scope.selectedSlot = null;
      };
      
      scope.cancelTimeTableSlotManage = function() {
	scope.vm = {};
	scope.showSlotForm = false;
	scope.end_time = null;
	scope.start_time = null;
	scope.selectedSlot = null;
      };
      
      scope.nullSelect = function() {
	scope.selectedSlot = null;
      };

      scope.registorTimeTableSlot = function() {
	scope.vm.time_table_id = scope.time_table.id;
	scope.vm.start_time = filter('date')(scope.start_time, "HH:mm");
	scope.vm.end_time = filter('date')(scope.end_time, "HH:mm");
	var millisecondsPerHour = 1000 * 60;
	scope.vm.durations = Math.round((scope.end_time - scope.start_time)/millisecondsPerHour);
	if(scope.vm.slot_type !== 'Class') {
	  scope.vm.subject_id = null;
	}
	var time_tables = Restangular.one("time_tables", scope.time_table.id);
	if(scope.vm.id){
	  time_tables.customPUT({time_table_class: scope.vm}, "time_table_classes/"+ scope.vm.id, {}).then(function(data) {
	    if(data.success) {
	      scope.events = _.reject(scope.events, function(d){ return d.id === scope.vm.id; });
	      scope.events.push(data.slot);
	      scope.cancelTimeTableSlotManage();
	      calculateTimeSlotes();
	    } else {
	    }
	  });
	} else {
	  time_tables.customPOST({time_table_class: scope.vm}, "time_table_classes", {}).then(function(data) {
	    scope.events.push(data.slot);
	    scope.cancelTimeTableSlotManage();
	    calculateTimeSlotes();
	  });
	}
      };

      
      var calculateTimeSlotes = function() {
	if(scope.events.length > 0){
	  var min_time = Math.trunc(_.min(_.pluck(scope.events, 'start_time')));
	  var max_time = Math.ceil(_.max(_.pluck(scope.events, 'end_time')));
	  scope.timeSlots = _.range(min_time, max_time+1);
	}
      };


      var getResultsPage = function() {
	jkci_classes.customGET('get_timetable').then(function(data){
	  if(data.success){
	    scope.time_table = data.time_table;
	    scope.subjects = data.subjects;
	    scope.events = data.slots;
	    scope.sub_classes = data.sub_classes;
	    calculateTimeSlotes();
	  } else {
	  }
	});
      };
      

      scope.$watch('classTimeTableTab', function(){
	if(scope.classTimeTableTab === 'true') {
	  scope.updateUrl({tabName: 'students'});
	}
	if(scope.classTimeTableTab === 'true' && scope.timeTableLoaded == false){
	  getResultsPage();
	  scope.timeTableLoaded = true;
	}
      });

    }]
  };
});
//end of timetable

app.directive('classDuplicateStudents', function(Restangular) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      classId: '@',
      classStudentVerificationTab: '@',
      updateUrl: '&',
      changeDuplicateRemaining: '&',
      recheckStudents: '&'
    },
    templateUrl: 'views/classes/duplicate_students.html',
    controller: ['$scope', 'Restangular', 'Flash', '$location', '$window', '$routeParams', '$route', function(scope, Restangular, Flash, $location, $window, $routeParams, $route){

      var jkci_classes = Restangular.one("jkci_classes", scope.classId);

      var getResultsPage = function() {
	jkci_classes.customGET("check_verify_students").then(function(data){
	  if(data.success) {
	    scope.students = data.class_students;
	    var remaining_students = _.where(scope.students, {is_duplicate: true, is_duplicate_accepted: false}).length;
	    scope.changeDuplicateRemaining({remainingValue: remaining_students});
	  }
	});
      };
      
      scope.recheckStudents({theDirFn: getResultsPage});
      
      scope.acceptStudent = function(row) {
	row.is_duplicate_accepted = true;
	jkci_classes.customPOST({student_id: row.student_id},"accept_duplicate_student", {}).then(function(data){
	  if(!data.success) {
	    row.is_duplicate_accepted = false;
	  } else {
	    var remaining_students = _.where(scope.students, {is_duplicate: true, is_duplicate_accepted: false}).length;
	    scope.changeDuplicateRemaining({remainingValue: remaining_students});
	  }
	});
      };
      
      scope.$watch('classStudentVerificationTab', function(){
	if(scope.classStudentVerificationTab === 'true') {
	  getResultsPage();
	  //scope.updateUrl({tabName: 'students'});
	}
      });

    }]
  };
});
// end of class student verifications


app.directive('classCatlogs', function(Restangular) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      classId: '@',
      classCatlogTab: '@',
      updateUrl: '&',
      hostUrl: '@'
    },
    templateUrl: 'views/classes/presenty_catlog.html',
    controller: ['$scope', 'Restangular', 'Flash', '$location', '$window', '$routeParams', '$route', function(scope, Restangular, Flash, $location, $window, $routeParams, $route){
      scope.classCatlogLoaded = false;
      scope.isOpen = false;
      scope.isOpenEnd = false;
      scope.selectedCatlogFilter = 'class_catlogs';
      var jkci_classes = Restangular.one("jkci_classes", scope.classId);
      
      scope.getResultsPage = function(filterValue) {
	scope.headers = scope.catlogs = [];
	scope.selectedCatlogFilter = filterValue;
	jkci_classes.customGET('presenty_catlog', {filter: filterValue}).then(function(data){
	  if(data.success) {
	    scope.headers = data.catlogs[0]
	    scope.catlogs = data.catlogs[1];
	  }
	});
      };

      scope.openCalendar = function(e) {
        e.preventDefault();
        e.stopPropagation();
        scope.isOpen = true;
      };

      scope.openCalendarEnd = function(e) {
        e.preventDefault();
        e.stopPropagation();
        scope.isOpenEnd = true;
      };
      
      
      scope.$watch('classCatlogTab', function(){
	if(scope.classCatlogTab === 'true') {
	  scope.updateUrl({tabName: 'class_catlogs'});
	}
	
	if(scope.classCatlogTab === 'true' && scope.classCatlogLoaded === false){
	  scope.getResultsPage(scope.selectedCatlogFilter);
	  scope.classCatlogLoaded = true;
	}
      });
    }]
  }
});
// end of class Catlog presenty
