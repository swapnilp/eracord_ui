'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('MeetingsCtrl',['$rootScope', '$scope', 'Flash', 'lazyFlash', '$location', 'Auth', 'Restangular', '$routeParams', 'Upload', '$window', '$cookieStore', function ($rootScope, $scope, Flash, lazyFlash, $location, Auth, Restangular, $routeParams, Upload, $window, $cookieStore) {

    if(!Auth.isAuthenticated()){
      $location.path('/user/sign_in').replace();
      return true;
    };
    
    if ($cookieStore.get('currentUser') === undefined) {
      $scope.eventSources = [];
      $location.path('/user/sign_in').replace();
      return true;
    }
    var parents_meetings = Restangular.all("parents_meetings");
    if($location.path() === '/meetings') {
      $scope.requestLoading = true;
      $scope.pagination = {
        current: 1
      };
      
      var getResultsPage = function(pageNumber){
	parents_meetings.customGET("", {page: pageNumber}).then(function(data){
	  $scope.meetings = data.parents_meetings;
	  $scope.totalCount = data.count;
	  $scope.requestLoading = false;
	});
      }

      $scope.pageChanged = function(newPage) {
        getResultsPage(newPage);
      };

      getResultsPage(1);

      $scope.pageChanged = function(newPage) {
        getResultsPage(newPage);
      };

      $scope.openInfo = function(row) {
	if(row.expanded === true) {
	  _.map($scope.meetings, function(student){ student.expanded = false;})
	}else {
	  _.map($scope.meetings, function(student){ student.expanded = false;})
	  row.expanded = true;
	}
      };
    }
    //end of meetings index method
    

    if($location.path() === '/meetings/new') {
      
      $scope.isOpen = false;
      $scope.dataLoading = false;
      $scope.studentList = [];
      $scope.openCalendar = function(e) {
        e.preventDefault();
        e.stopPropagation();
        $scope.isOpen = true;
      };

      var getInfo = function(){
	parents_meetings.customGET("new").then(function(data){
	  if(data.success){
	    $scope.jk_classes = data.classes;
	  }else {
	  }
	})
      };

      getInfo();

      $scope.registerMeeting = function() {
	$scope.dataLoading = true;

	parents_meetings.customPOST({parents_meeting: $scope.vm}, "", {student_list: $scope.studentList.join(',')}).then(function(data){
	  if(data.success) {
	    lazyFlash.success("Meeting has been created");
	    $location.path("/meetings").replace();
	  }else {
	    Flash.create('warning', "Something went wrong", 0, {}, true);
	  }
	  $scope.dataLoading = false;
	});
      };
    }
    //end of meetings new method

    if($location.path() === '/meetings/' + $routeParams.id + '/show') {
      
      $scope.meetingId = $routeParams.id;
      $scope.requestLoading = true;
      
      Restangular.one("parents_meetings", $routeParams.id).get().then(function(data){
	if(data.success) {
	  $scope.meeting = data.parents_meeting;
	} else {
	  lazyFlash.warning("Record Not found");
	  $location.path('/meetings').replace();
	}
	$scope.requestLoading = false;
      });

      $scope.publishMeeting = function() {
	Restangular.one("parents_meetings", $routeParams.id).customGET("publish_meeting").then(function(data){
	  if(data.success) {
	    $scope.meeting.sms_sent = true;
	    Flash.create('success', "Meeting has been published", 0, {}, true);
	  } else {
	    Flash.create('warning', "Something went wrong", 0, {}, true);
	  }
	});
      }
    }
    //end of meetings show method
  }
]);

