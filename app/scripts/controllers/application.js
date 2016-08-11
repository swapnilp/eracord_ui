'use strict';
var app;

app = angular.module('eracordUiApp.controller');

app.controller('ApplicationCtrl', function($rootScope, $scope, $location, $routeParams, $window, Auth, Flash, Restangular, $cookieStore, $uibModal) {
  var clearUserInformation, directAccessRoutes, i, len, path;
  $scope.userAlertCount = 0;
  $scope.alertsVisible = false;
  $scope.firstLoad = false;
  $scope.topMenu = "home";
  $rootScope.logoUrl = "";
  

  $scope.hostUrl = "http://localhost:3000";
  //$scope.hostUrl = "http://54.152.133.36:3000/";
  //$scope.hostUrl = "http://192.168.0.100:3000/";  
  

  if ($rootScope.currentUser === undefined) {
    $rootScope.currentUser = {};
  }

  $scope.goBack = function() {
    return window.history.back();
  };

  $scope.reloadPage = function() {
    $window.location.reload();
  };
  
  directAccessRoutes = ['/forgot-password/?', '/unlock-account/?', '/users/invitation/accept/?', '/users/password/edit/?', '/users/unlock/?'];
  for (i = 0, len = directAccessRoutes.length; i < len; i++) {
    path = directAccessRoutes[i];
    if ($location.path().search(path) !== -1) {
      return;
    }
  }
  
  if ($cookieStore.get('currentUser') === null && $location.path() !== '/user/sign_in') {
    $location.path('/user/sign_in');
  }
  
  if ($location.path() !== '/user/sign_in' || $location.path() !== '/user/forgot_password') {
    Auth._currentUser = $cookieStore.get('currentUser');
    if(Auth._currentUser !== undefined) {
      Auth.currentUser().then(function(user) {
	$rootScope.currentUser = user;
	$rootScope.logoUrl  = $rootScope.currentUser.logo_url;
      });
    }
  }

  clearUserInformation = function() {
    $cookieStore.remove('currentUser');
    $rootScope.currentUser = {};
    $rootScope.logoUrl = "";
    return $rootScope.currentUser;
  };

  $scope.doLogout = function() {
    Auth.logout().then(function() {
      clearUserInformation();
      return $location.path('/user/sign_in');
    });
  };
  
  $scope.open = function (size, reason) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'views/help/index.html',
      controller: 'HelpCtrl',
      size: size,
      resolve: {
	reason: function(){
	  return reason;
	}
      }
    });
    
    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      //$log.info('Modal dismissed at: ' + new Date());
    });
  };

  $rootScope.$on('devise:unauthorized', function(loopPrevention) {
    
    if (loopPrevention === null) {
      loopPrevention = false;
    }
    $scope.doLogout();
    $rootScope.logoUrl = "";
    if (loopPrevention) {
      if ($cookieStore.get('currentUser') === null) {
        return;
      }
      clearUserInformation();
      //Flash.clear();
      //return Flash.alert('Session error. Please log in again.').andRedirectTo('/user/sign_in');
    }
  });

  $scope.$on('$routeChangeStart', function(next, current) { 
    if($location.path().search("/classes") >= 0 || $location.path().search("/admin_desk") >= 0){
      $scope.topMenu = "admin_desk";
      $scope.dropDowmMenu = null;
    }
    if($location.path().search("^/exams") >= 0 ){
      $scope.topMenu = "exams";
      $scope.dropDowmMenu = 'academic';
    }
    if($location.path().search("^/manage_organisation") >= 0 || $location.path().search("^/edit_organisation") >= 0 || $location.path().search("^/organisations") >= 0 || $location.path().search("^/remaining_organisation_courses") >= 0){
      $scope.topMenu = "manage_organisation";
      $scope.dropDowmMenu = null;
    }
    if($location.path().search("^/students") >= 0 ){
      $scope.topMenu = "students";
      $scope.dropDowmMenu = 'academic';
    }
    if($location.path().search("^/teachers") >= 0 ){
      $scope.topMenu = "teachers";
      $scope.dropDowmMenu = 'academic';
    }
    if($location.path().search("^/off_classes") >= 0 ){
      $scope.topMenu = "off_classes";
      $scope.dropDowmMenu = 'academic';
    }
    if($location.path().search("^/contact") >= 0 ){
      $scope.topMenu = "contacts";
      $scope.dropDowmMenu = null;
    }
    if($location.path().search("^/user") >= 0 ){
      $scope.topMenu = "users";
      $scope.dropDowmMenu = 'users';
    }
    if($location.path().search("^/class_rooms") >= 0 ){
      $scope.topMenu = "class_rooms";
      $scope.dropDowmMenu = 'non_academic';
    }
    if($location.path().search("/user/sign_in") >= 0 ){
      $scope.topMenu = "home";
      $scope.dropDowmMenu = null;
    }
    if($location.path().search("/accounts") >= 0 ){
      $scope.topMenu = "accounts";
      $scope.dropDowmMenu = 'non_academic';
    }
    if($location.path().search("^/sms") >= 0){
      $scope.topMenu = "sms";
      $scope.dropDowmMenu = 'non_academic';
    }
    if($location.path().search("^/meetings") >= 0){
      $scope.topMenu = "meetings";
      $scope.dropDowmMenu = 'non_academic';
    }
    if($location.path() === "/"){
      $scope.topMenu = "home";
      $scope.dropDowmMenu = null;
    }
  });

});
