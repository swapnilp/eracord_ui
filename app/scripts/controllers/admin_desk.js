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
    $scope.calenderExamSelect = true;
    $scope.calenderCatlogSelect = false;
    $scope.loadCalenderEvent = false;
    $scope.loadCalenderTimeTableEvent = false;

    /* add custom event*/
    var addExamEvent = function(event) {
      $scope.events.push({
	type: event.type,
        title: event.title,
        start: new Date(event.start),
        end: new Date(event.end),
	url: event.url
      });
    };

    var addTimeTableEvent = function(type, title, cwday) {
      $scope.events.push({
	type: type,
        title: title,
	dow: cwday,
	allDay: true
      });
    };

    $scope.load_desk_classes = function(){
      var jkci_classes = Restangular.all("jkci_classes");
      jkci_classes.getList().then(function(data){
	$scope.jkci_classes = data;
      });
    };

    $scope.load_unassigned_classes = function(){
      var unassigned_jkci_classes = Restangular.all("get_unassigned_classes");
      unassigned_jkci_classes.getList().then(function(data){
	$scope.us_jkci_classes = data;
      });
    };

    $scope.load_calender_exams = function(start, end) {
      var exams = Restangular.all("exams").customGET("calender_index", {start: start, end: end}).then(function(data) {
	if(data.success) {
	  _.each(data.exams, function(exam){
	    addExamEvent(exam);
	  });
	  $scope.loadCalenderEvent = false;
	}
      });
    };

    $scope.load_calender_time_table = function(start, end) {

      var time_table = Restangular.all("time_tables").customGET("calender_index").then(function(data) {
	if(data.success) {
	  var time_table_slot = null;
	  for(var i=1; i< 8;i += 1) {
	    time_table_slot = _.where(data.time_table_classes, {cwday: i});
	    if(time_table_slot.length > 0) {
	      addTimeTableEvent('time_table', _.pluck(time_table_slot, 'name').join(','), [i]);
	    }
	  }
	  $scope.loadCalenderTimeTableEvent = false;
	}
      });
    };
    
    $scope.calendarView = 'month';
    $scope.calendarDate = new Date();

    $scope.load_desk_classes();
    $scope.load_unassigned_classes();

    //@@@@@@@@@@@@@@

    
    $scope.reloadCalenderEvent = function() {
      uiCalendarConfig.calendars['myCalendar'].fullCalendar('refetchEvents');
    };

    $scope.examEvents = function( start, end, timezone, callback) {
      $scope.loadCalenderEvent = true;
      if($scope.calenderExamSelect) {
	$scope.load_calender_exams(start.format("DD/MM/YYYY"), end.format("DD/MM/YYYY"));
      } else {
	$scope.loadCalenderEvent = false;
      }
    };

    $scope.timeTableEvents = function(start, end, timezone, callback) {
      $scope.loadCalenderTimeTableEvent = true;
      if($scope.calenderCatlogSelect) {
	$scope.load_calender_time_table(start, end);
	//$scope.load_calender_exams(start.format("DD/MM/YYYY"), end.format("DD/MM/YYYY"));
      } else {
	$scope.loadCalenderTimeTableEvent = false;
      }
    }
    
    /* event source that calls a function on every view switch */
    $scope.eventsF = function (start, end, timezone, callback) {
      var s = new Date(start).getTime() / 1000;
      var e = new Date(end).getTime() / 1000;
      var m = new Date(start).getMonth();
      var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
      callback(events);
    };

    /* alert on eventClick */
    $scope.alertOnEventClick = function( date, jsEvent, view){
      $scope.alertMessage = (date.title + ' was clicked ');
    };

    $scope.alertOnDayClick = function( data){
      console.log(data);
    }
    /* alert on Drop */
     $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
       $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
    };
    /* alert on Resize */
    $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
       $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };
    
    
    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function(sources,source) {
      var canAdd = 0;
      angular.forEach(sources,function(value, key){
        if(sources[key] === source){
          sources.splice(key,1);
          canAdd = 1;
        }
      });
      if(canAdd === 0){
        sources.push(source);
      }
    };
    
    /* remove event */
    $scope.remove = function(index) {
      $scope.events.splice(index,1);
    };
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
        eventClick: $scope.alertOnEventClick,
	dayClick: $scope.alertOnDayClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender
      }
    };

    /* event sources array*/
    $scope.eventSources = [$scope.events, $scope.examEvents, $scope.timeTableEvents];
    
    
  }]);

