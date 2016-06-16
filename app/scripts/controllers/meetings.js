'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('MeetingsCtrl',['$rootScope', '$scope', 'Flash', '$location', 'Auth', 'Restangular', '$routeParams', 'Upload', '$window', '$cookieStore', function ($rootScope, $scope, Flash, $location, Auth, Restangular, $routeParams, Upload, $window, $cookieStore) {

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

	parents_meetings.customPOST({parents_meeting: $scope.vm}, "", {}).then(function(data){
	  if(data.success) {
	    Flash.create('success', "Meeting Sms will send shortly", 'alert-success');
	    $location.path("/admin_desk").replace();
	  }else {
	    Flash.create('warning', "Something went wrong", 'alert-warning');
	  }
	  $scope.dataLoading = false;
	});
      };
    }
    //end of meetings new method

    if($location.path() === '/meetings/' + $routeParams.id + '/show') {
      
      $scope.meetingId = $routeParams.id;
	
      Restangular.one("parents_meetings", $routeParams.id).get().then(function(data){
	$scope.meeting = data.parents_meeting;
      });
    }
    //end of meetings show method
  }
]);

