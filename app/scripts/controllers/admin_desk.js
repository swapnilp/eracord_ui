'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('AdminDeskCtrl',['$rootScope', '$scope', 'Flash', '$location', 'Auth', 'Restangular','$compile', 'uiCalendarConfig' , function ($rootScope, $scope, Flash, $location, Auth, Restangular, $compile, uiCalendarConfig) {

    if(!Auth.isAuthenticated()){
      $location.path('/user/sign_in');
      return true;
    }

    $scope.events= [];
    $scope.selectedCalenderType = 'exams';
    $scope.loadCalenderEvent = false;

    var load_desk_classes = function(){
      var jkci_classes = Restangular.all("jkci_classes");
      jkci_classes.getList().then(function(data){
	$scope.jkci_classes = data;
      });
    };

    var load_unassigned_classes = function(){
      var unassigned_jkci_classes = Restangular.all("get_unassigned_classes");
      unassigned_jkci_classes.getList().then(function(data){
	$scope.us_jkci_classes = data;
      });
    };

    var load_calender_exams = function(start, end, callback) {
      var examEvents = [];
      Restangular.all("exams").customGET("calender_index", {start: start, end: end}).then(function(data) {
	if(data.success) {
	  
	  _.each(data.exams, function(exam){
	    //addExamEvent(exam);
	    examEvents.push({
	      type: exam.type,
              title: exam.title,
              start: new Date(exam.start),
              end: new Date(exam.end),
	      url: exam.url
	    });
	  });
	  $scope.loadCalenderEvent = false;
	  callback(examEvents);
	}
      });
    };
    
    var load_calender_time_table = function(start, end, callback) {
      Restangular.all("time_tables").customGET("calender_index").then(function(data) {
	if(data.success) {
	  var timeTableEvents = [];
	  var time_table_slot = null;
	  for(var i=1; i< 8;i += 1) {
	    time_table_slot = _.where(data.time_table_classes, {cwday: i});
	    if(time_table_slot.length > 0) {
	      timeTableEvents.push({
		type: 'time_table',
		title: _.pluck(time_table_slot, 'name').join(','),
		dow: [i],
		allDay: true
	      });
	    }
	  }
	  $scope.loadCalenderEvent = false;
	  callback(timeTableEvents);
	}
      });
    };
    
     var load_calender_off_class = function(start, end, callback) {
       var offClassEvents = [];
      Restangular.all("off_classes").customGET("calender_index").then(function(data) {
	if(data.success) {
	  _.each(data.off_classes, function(off_class) {
	    var date = new Date(off_class.date);
	    offClassEvents.push({
	      type: 'off class',
              title: off_class.name,
	      start: date,
	      allDay: true,
	      className: ['bg-red-danger']
	    });
	  });
	  $scope.loadCalenderEvent = false;
	  callback(offClassEvents);
	}
      });
    };
    
    load_desk_classes();
    load_unassigned_classes();

    
    $scope.reloadCalenderEvent = function(selectedType) {
      $scope.selectedCalenderType = selectedType;
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
      console.log(data);
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
        element.attr({'uib-tooltip': event.title,
                     'tooltip-append-to-body': true});
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

