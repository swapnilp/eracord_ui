'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('AdminDeskCtrl',['$rootScope', '$scope', 'Flash', '$location', 'Auth', 'Restangular','$compile', 'uiCalendarConfig', '$cookieStore' , function ($rootScope, $scope, Flash, $location, Auth, Restangular, $compile, uiCalendarConfig, $cookieStore) {

    if(!Auth.isAuthenticated()){
      $scope.eventSources = [];
      $location.path('/user/sign_in').replace();
      return true;
    }

    $scope.events= [];
    $scope.selectedCalenderType = 'exams';
    $scope.loadCalenderEvent = false;
    $scope.standardCalenderFilter = null;
    $scope.requestLoading = true;
    $scope.noData = false;
    $scope.jkci_classes = [];
    $scope.us_jkci_classes = [];
    $scope.org_standards = []
    
    if ($cookieStore.get('currentUser') === undefined) {
      $scope.eventSources = [];
      $location.path('/user/sign_in').replace();
      return true;
    } 


    var load_desk_classes = function(){
      var jkci_classes = Restangular.all("jkci_classes");
      jkci_classes.getList().then(function(data){
	$scope.jkci_classes = data;
	$scope.requestLoading = false;
      });
    };

    var load_standards = function() {
      Restangular.all("organisations").customGET("cources").then(function(data) {
	$scope.org_standards = _.filter(data.body, function(num){ return num.is_active; });
	if($scope.org_standards.length === 0 && $scope.us_jkci_classes.length === 0) {
	  $scope.noData = true;
	} else {
	  $scope.noData = false;
	}
      });
    }
    

    var load_unassigned_classes = function(){
      var unassigned_jkci_classes = Restangular.all("get_unassigned_classes");
      unassigned_jkci_classes.getList().then(function(data){
	$scope.us_jkci_classes = data;
	if($scope.us_jkci_classes.length === 0 && $scope.org_standards.length === 0) {
	  $scope.noData = true;
	} else {
	  $scope.noData = false;
	}
      });
    };

    var load_calender_exams = function(start, end, callback) {
      var examEvents = [];
      Restangular.all("exams").customGET("calender_index", {start: start, end: end, standard: $scope.standardCalenderFilter}).then(function(data) {
	if(data.success) {
	  
	  _.each(data.exams, function(exam){
	    //addExamEvent(exam);
	    if(exam.selfOrg){
	      examEvents.push({
		type: exam.type,
		title: exam.title,
		start: new Date(exam.start),
		end: new Date(exam.end),
		url: exam.url,
		name: "exams"
	      });
	    }else {
	      examEvents.push({
		type: exam.type,
		title: exam.title,
		start: new Date(exam.start),
		end: new Date(exam.end),
		className: ['bg-info-black'],
		name: "exams"
	      });
	    }
	  });
	  $scope.loadCalenderEvent = false;
	  callback(examEvents);
	}
      });
    };
    
    var load_calender_time_table = function(start, end, callback) {
      Restangular.all("time_tables").customGET("calender_index", { standard: $scope.standardCalenderFilter}).then(function(data) {
	if(data.success) {
	  var timeTableEvents = [];
	  var time_table_slot = null;
	  for(var i=1; i< 8;i += 1) {
	    time_table_slot = _.where(data.time_table_classes, {cwday: i});
	    _.each(time_table_slot, function(tts){
	      timeTableEvents.push({
		type: tts.start_time,
		title: tts.name,
		dow: [i],
		allDay: true,
		name: "time_table",
		jkci_class_id: tts.jkci_class_id,
		subject_id: tts.subject_id
	      });
	    });
	  }
	  $scope.loadCalenderEvent = false;
	  callback(timeTableEvents);
	}
      });
    };
    
     var load_calender_off_class = function(start, end, callback) {
       var offClassEvents = [];
      Restangular.all("off_classes").customGET("calender_index", {start: start, end: end, standard: $scope.standardCalenderFilter}).then(function(data) {
	if(data.success) {
	  _.each(data.off_classes, function(off_class) {
	    var date = new Date(off_class.date);
	    offClassEvents.push({
	      type: off_class.teacher_name,
              title: off_class.name,
	      start: date,
	      allDay: true,
	      className: ['bg-red-danger'],
	      name: "exams"
	    });
	  });
	  $scope.loadCalenderEvent = false;
	  callback(offClassEvents);
	}
      });
    };
    
    load_desk_classes();
    load_standards();
    load_unassigned_classes();

    
    $scope.reloadCalenderEvent = function(selectedType) {
      $scope.selectedCalenderType = selectedType;
      uiCalendarConfig.calendars['myCalendar'].fullCalendar('refetchEvents');
    };

    $scope.filterCalander = function() {
      uiCalendarConfig.calendars['myCalendar'].fullCalendar('refetchEvents');
    };

    $scope.loadEvents = function(start, end, timezone, callback) {
      $scope.loadCalenderEvent = true;
      var events = [];
      if($scope.selectedCalenderType === 'exams') {
	load_calender_exams(start.format("DD/MM/YYYY"), end.format("DD/MM/YYYY"), callback);
      }else if ($scope.selectedCalenderType === 'time_table'){
	load_calender_time_table(start, end, callback);
      }else if($scope.selectedCalenderType === 'off_class'){
	load_calender_off_class(start, end, callback);
      }
    };
    

    $scope.alertOnDayClick = function( data){
      //console.log(data);
    }
    
    
    /* Change View */
    $scope.changeView = function(view,calendar) {
      uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
    };
    /* Change View */
    $scope.renderCalender = function(calendar) {
      if(uiCalendarConfig.calendars[calendar]){
        uiCalendarConfig.calendars[calendar].fullCalendar('render');
      }
    };

     /* Render Tooltip */
    $scope.eventRender = function( event, element, view ) { 
      element.attr({'uib-tooltip': event.type,
        'tooltip-append-to-body': true});
      //element.attr({'href': "asdasd"})
      if(event.name == "time_table" && (event.start.format("MMM D") === moment().format("MMM D"))) {
	element.attr({'href': "#/classes/"+event.jkci_class_id+"/daily_catlogs/new?&subject_id="+event.subject_id})
      }else if(event.name == "time_table"){
	element.attr({'class': element.attr("class")+" bg-info-black"})
	//event.className.push("bg-info-black");
      }
      $compile(element)($scope);
    };

    
    /* config object */
    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: false,
        header:{
          left: 'month agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
	dayClick: $scope.alertOnDayClick,
        eventRender: $scope.eventRender
      }
    };

    /* event sources array*/
    $scope.eventSources = [$scope.events, $scope.loadEvents]
    
  }]);

