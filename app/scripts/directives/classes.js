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
      hostUrl: '@',
      newStudent: '@'
    },
    templateUrl: 'views/students/index.html',
    controller: ['$scope', 'Restangular', 'Flash', '$location', '$window', '$routeParams', '$route', 'Upload', '$cookieStore', '$uibModal', function(scope, Restangular, Flash, $location, $window, $routeParams, $route, Upload, $cookieStore, $uibModal){
      scope.cources = [];
      scope.showRollNumber = true;
      scope.isRollNumber = true;
      scope.requestLoading = true;
      scope.studentLoaded = false;

      var jkci_classes = Restangular.one("jkci_classes", scope.classId);
      scope.token = $cookieStore.get('currentUser').token;

      scope.totalStudents = 0;
      
      scope.pagination = {
        current: $routeParams.page || 1
      };

      scope.openInfo = function(row) {
	if(row.expanded === true) {
	  _.map(scope.students, function(student){ student.expanded = false;})
	}else {
	  _.map(scope.students, function(student){ student.expanded = false;})
	  row.expanded = true;
	}
      };
      
      scope.openAssignStudentModel = function(size) {
	var modalInstance = $uibModal.open({
	  animation: true,
	  templateUrl: 'views/classes/assign_students.html',
	  controller: 'ClassAssignStudentCtrl',
	  size: size,
	  resolve: {
	    class_id: function(){
	      return scope.classId;
	    }
	  }
	});
	
	modalInstance.result.then(null, function () {
	  getResultsPage(1);
	});
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
	scope.requestLoading = true;
	jkci_classes.customGET("students", {page: pageNumber, search: scope.filterStudent}).then(function(data){
	  scope.students = data.students;
	  scope.totalStudents = data.count;
	  scope.has_show_pay_info = data.has_show_pay_info;
	  scope.has_pay_fee = data.has_pay_fee;
	  scope.pagination = {
            current: pageNumber || 1
	  };
	  scope.requestLoading = false;
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
      scope.showFilter = true;
      scope.showClassFilter = false;
      var jkci_classes = Restangular.one("jkci_classes", scope.classId);
      scope.totalExams = 0;
      scope.showResetFilter = false;
      scope.requestLoading = true;
      scope.filterExam = {};
      
      scope.pagination = {
        current: $routeParams.page || 1
      };
      
      scope.resetFilter = function() {
	scope.filterExam = {};
	scope.showResetFilter = false;
	getResultsPage(1, true);
      };
      
      var getResultsPage = function(pageNumber, checkFilter) {
	//$route.updateParams({ page: pageNumber});
	if(!checkFilter && _.size(scope.filterExam) === 0) {
	  return true;
	}
	if(_.size(scope.filterExam) >  0) {
	  scope.showResetFilter = true;
	}
	scope.requestLoading = true;
	jkci_classes.customGET("exams" ,{page: pageNumber, filter: scope.filterExam}).then(function(data){
	  scope.exams = data.body;
	  scope.totalExams = data.count;
	  scope.length = data.count;
	  scope.pagination = {current: pageNumber || 1};
	  scope.requestLoading = false;
	});

      };
      
      scope.pageChanged = function(newPage, checkFilter) {
        getResultsPage(newPage, checkFilter);
      };
      
      scope.isRemove = true;
      scope.loadClassExams = function() {
	
      };

      scope.$watch('classExamsTab', function(){
	if(scope.classExamsTab === 'true') {
	  scope.updateUrl({tabName: 'exams'});
	}
	if(scope.classExamsTab === 'true' && scope.examsLoaded == false){
	  getResultsPage($routeParams.page || 1, true);
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
      scope.requestLoading = true;

      
      var getResultsPage = function(pageNumber) {
	scope.requestLoading = true;
	jkci_classes.customGET('daily_teachs', {page: pageNumber}).then(function(data){
	  if(data.success) {
	    scope.dtps = data.daily_teaching_points;
	    scope.totalDtps = data.count;
	    //$route.updateParams({ page: pageNumber});
	    scope.requestLoading = false;
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
	  dailyCatlogLoaded = true;
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
    controller: ['$scope', '$filter', 'Restangular', 'Flash', '$location', '$window', '$routeParams', '$route', '$uibModal', function(scope, filter, Restangular, Flash, $location, $window, $routeParams, $route, $uibModal){
      
      scope.timeTableLoaded = false;
      var jkci_classes = Restangular.one("jkci_classes", scope.classId);
      scope.requestLoading = true;
      scope.dataLoading = false;
      scope.deleteLoading = false;

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
	scope.deleteLoading = true;
	var time_table_rec = Restangular.one("time_tables", scope.time_table.id);
	time_table_rec.one("time_table_classes", slot.id).remove().then(function(data){
	  if(data.success) {
	    scope.events = _.reject(scope.events, function(d){ return d.id === slot.id; });
	    scope.selectedSlot = null;
	    calculateTimeSlotes();
	  } else {
	  }
	  scope.deleteLoading = false;
	});
      };

      scope.editTimeTableSlot= function(selectedSlot) {
	scope.vm.id = selectedSlot.id;
	scope.vm.subject_id = selectedSlot.subject_id;
	scope.vm.cwday = ""+selectedSlot.cwday;
	scope.vm.slot_type = selectedSlot.slot_type;
	scope.vm.sub_class_id = selectedSlot.sub_class_id;
	scope.vm.class_room = selectedSlot.class_room;
	scope.vm.teacher_id = selectedSlot.teacher_id;
	scope.vm.teacher_name = selectedSlot.teacher_name;
	scope.start_time = new Date("3/3/2016 "+ (""+parseFloat(selectedSlot.start_time).toFixed(2)).replace(".", ":"));
	//user dummy date
	scope.end_time = new Date("3/3/2016 "+ (""+parseFloat(selectedSlot.end_time).toFixed(2)).replace(".", ":"));
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
      
      scope.openSelectTeacher = function (size) {
	var modalInstance = $uibModal.open({
	  animation: true,
	  templateUrl: 'views/teachers/assign_teacher.html',
	  controller: 'AssignTeacherCtrl',
	  size: size,
	  resolve: {
	    class_id: function(){
	      return scope.classId;
	    },
	    time_table_id: function(){
	      return scope.time_table_id;
	    },
	    teacher_id: function(){
	      return scope.vm.teacher_id;
	    }
	  }
	});
	
	modalInstance.result.then(function (selectedTeacher) {
	  //console.log(selectedItem)
	  scope.vm.teacher_name = selectedTeacher.name;
	  scope.vm.teacher_id = selectedTeacher.id;
	}, null);
      }
      
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
	scope.dataLoading = true;
	scope.vm.time_table_id = scope.time_table.id;
	scope.vm.start_time = filter('date')(scope.start_time, "HH:mm").replace(":", ".");
	scope.vm.end_time = filter('date')(scope.end_time, "HH:mm").replace(":", ".");
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
	    scope.dataLoading = false;
	  });
	} else {
	  time_tables.customPOST({time_table_class: scope.vm}, "time_table_classes", {}).then(function(data) {
	    scope.events.push(data.slot);
	    scope.cancelTimeTableSlotManage();
	    calculateTimeSlotes();
	    scope.dataLoading = false;
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
	    scope.time_table_id = scope.time_table.id;
	    scope.subjects = data.subjects;
	    scope.events = data.slots;
	    scope.sub_classes = data.sub_classes;
	    calculateTimeSlotes();
	  } else {
	  }
	  scope.requestLoading = false;
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
    controller: ['$scope', 'Restangular', 'Flash', '$location', '$window', '$routeParams', '$route', '$uibModal', function(scope, Restangular, Flash, $location, $window, $routeParams, $route, $uibModal){

      var jkci_classes = Restangular.one("jkci_classes", scope.classId);
      scope.requestLoading = true;
      scope.divisionRequestLoading = true;

      var getResultsPage = function() {
	scope.requestLoading = true;
	jkci_classes.customGET("check_verify_students").then(function(data){
	  if(data.success) {
	    scope.students = data.class_students;
	    scope.totalStudents = data.total_students;
	    var remaining_students = _.where(scope.students, {is_duplicate: true, is_duplicate_accepted: false}).length;
	    scope.changeDuplicateRemaining({remainingValue: remaining_students});
	    scope.requestLoading = false;
	  }
	});
      };

      var loadDivisions = function() {
	scope.divisionRequestLoading = true;
	jkci_classes.customGET("sub_classes").then(function(data) {
	  if(data.success) {
	    scope.divisions = data.sub_classes;
	  }else {
	  }
	  scope.divisionRequestLoading = false;
	});
      }

      scope.openAssignStudentModel = function(size, division_id) {
	var modalInstance = $uibModal.open({
	  animation: true,
	  templateUrl: 'views/classes/assign_students.html',
	  controller: 'DivisionAssignStudentCtrl',
	  size: size,
	  resolve: {
	    class_id: function(){
	      return scope.classId;
	    },
	    division_id: function(){
	      return division_id;
	    }
	  }
	});
	
	modalInstance.result.then(null, function () {
	  loadDivisions();
	});

      }
      
      scope.openInfo = function(row) {
	if(row.expanded === true) {
	  _.map(scope.students, function(student){ student.expanded = false;})
	}else {
	  _.map(scope.students, function(student){ student.expanded = false;})
	  row.expanded = true;
	}
      };

      scope.removeStudent = function(student) {
	if($window.confirm('Are you sure?')){
	  jkci_classes.one('students', student.student_id).remove().then(function(data){
	    if(data.success) {
	      scope.students = _.reject(scope.students, function(obj){return obj.student_id == student.student_id});
	    }else {
	    }
	  });
	}
      }
      
      scope.recheckStudents({theDirFn: getResultsPage});
      
      scope.acceptStudent = function(row) {
	row.dataLoading = true;
	jkci_classes.customPOST({student_id: row.student_id},"accept_duplicate_student", {}).then(function(data){
	  if(!data.success) {
	    row.is_duplicate_accepted = false;
	  } else {
	    row.is_duplicate_accepted = true;
	    var remaining_students = _.where(scope.students, {is_duplicate: true, is_duplicate_accepted: false}).length;
	    scope.changeDuplicateRemaining({remainingValue: remaining_students});
	  }
	  row.dataLoading = false;
	});
      };
      
      scope.$watch('classStudentVerificationTab', function(){
	if(scope.classStudentVerificationTab === 'true') {
	  getResultsPage();
	  loadDivisions();
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
    controller: ['$scope', 'Restangular', 'Flash', '$location', '$window', '$routeParams', '$route', '$cookieStore', function(scope, Restangular, Flash, $location, $window, $routeParams, $route, $cookieStore){
      scope.classCatlogLoaded = false;
      scope.isOpen = false;
      scope.isOpenEnd = false;
      scope.selectedCatlogFilter = 'class_catlogs';
      scope.requestLoading = true;
      
      var jkci_classes = Restangular.one("jkci_classes", scope.classId);
      
      scope.token = $cookieStore.get('currentUser').token;
      
      scope.getResultsPage = function(filterValue) {
	scope.requestLoading = true;
	scope.headers = scope.catlogs = [];
	scope.selectedCatlogFilter = filterValue;
	jkci_classes.customGET('presenty_catlog', {filter: filterValue}).then(function(data){
	  if(data.success) {
	    scope.headers = data.catlogs[0]
	    scope.catlogs = data.catlogs[1];
	    scope.requestLoading = false;
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
