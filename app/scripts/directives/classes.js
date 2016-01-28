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
      showOptions: '@'
    },
    templateUrl: 'views/students/index.html',
    controller: ['$scope', 'Restangular', 'Flash', '$location', '$window', '$routeParams', '$route', function(scope, Restangular, Flash, $location, $window, $routeParams, $route){
      scope.cources = [];
      scope.showRollNumber = true;
      
      scope.studentLoaded = false;
      var jkci_classes = Restangular.one("jkci_classes", scope.classId);

      scope.totalStudents = 0;
      
      scope.pagination = {
        current: $routeParams.page || 1
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
