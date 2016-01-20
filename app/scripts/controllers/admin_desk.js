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

    var addOffClassEvent = function(type, title, date) {
      $scope.events.push({
	type: type,
        title: title,
	start: new Date(date),
	allDay: true,
	className: ['bg-red-danger']
      });
    };

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

    var load_calender_exams = function(start, end) {
      Restangular.all("exams").customGET("calender_index", {start: start, end: end}).then(function(data) {
	if(data.success) {
	  _.each(data.exams, function(exam){
	    addExamEvent(exam);
	  });
	  $scope.loadCalenderEvent = false;
	}
      });
    };

    var load_calender_time_table = function(start, end) {
      Restangular.all("time_tables").customGET("calender_index").then(function(data) {
	if(data.success) {
	  var time_table_slot = null;
	  for(var i=1; i< 8;i += 1) {
	    time_table_slot = _.where(data.time_table_classes, {cwday: i});
	    if(time_table_slot.length > 0) {
	      addTimeTableEvent('time_table', _.pluck(time_table_slot, 'name').join(','), [i]);
	    }
	  }
	  $scope.loadCalenderEvent = false;
	}
      });
    };
    
     var load_calender_off_class = function(start, end) {
      Restangular.all("off_classes").customGET("calender_index").then(function(data) {
	if(data.success) {
	  _.each(data.off_classes, function(off_class){
	    addOffClassEvent('off class', off_class.name, off_class.date);
	  });
	  $scope.loadCalenderEvent = false;
	}
      });
    };
    
    load_desk_classes();
    load_unassigned_classes();

    //@@@@@@@@@@@@@@

    
    $scope.reloadCalenderEvent = function(selectedType) {
      $scope.selectedCalenderType = selectedType;
      uiCalendarConfig.calendars['myCalendar'].fullCalendar('refetchEvents');
    };

    $scope.loadEvents = function(start, end, timezone, callback) {
      $scope.loadCalenderEvent = true;
      //$scope.events =[{__id: 1}];
      if($scope.selectedCalenderType === 'exams') {
	load_calender_exams(start.format("DD/MM/YYYY"), end.format("DD/MM/YYYY"));
      }else if ($scope.selectedCalenderType === 'time_table'){
	load_calender_time_table(start, end);
      }else if($scope.selectedCalenderType === 'off_class'){
	load_calender_off_class(start, end);
      }
      console.log($scope.events);
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

