'use strict';
var app;

app = angular.module('eracordUiApp.controller');

app.controller('ApplicationCtrl', function($rootScope, $scope, $location, $routeParams, $window, Auth, Flash, Restangular, $cookieStore) {
  var clearUserInformation, directAccessRoutes, i, len, path;
  $scope.userAlertCount = 0;
  $scope.alertsVisible = false;
  $scope.firstLoad = false;
  $scope.topMenu = "home";


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
  
  if ($cookieStore.get('currentUser') === null) {
    $location.path('/user/sign_in');
  }
  
  if ($location.path() !== '/user/sign_in' || $location.path() !== '/user/forgot_password') {
    Auth._currentUser = $cookieStore.get('currentUser');
    if(Auth._currentUser !== undefined) {
      Auth.currentUser().then(function(user) {
       $rootScope.currentUser = user;
      });
    }
  }


  clearUserInformation = function() {
    $cookieStore.remove('currentUser');
    $rootScope.currentUser = {};
    return $rootScope.currentUser;
  };

  $scope.doLogout = function() {
    Auth.logout().then(function() {
      clearUserInformation();
      return $location.path('/user/sign_in');
    });
  };


  $rootScope.$on('devise:unauthorized', function(loopPrevention) {

    if (loopPrevention === null) {
      loopPrevention = false;
    }
    $scope.doLogout();
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
    }
    if($location.path().search("^/exams") >= 0 ){
      $scope.topMenu = "exams";
    }
    if($location.path().search("^/manage_organisation") >= 0 || $location.path().search("^/edit_organisation") >= 0 || $location.path().search("^/organisations") >= 0 || $location.path().search("^/remaining_organisation_courses") >= 0){
      $scope.topMenu = "manage_organisation";
    }
    if($location.path().search("^/students") >= 0 ){
      $scope.topMenu = "students";
    }
    if($location.path().search("^/contact") >= 0 ){
      $scope.topMenu = "contacts";
    }
    if($location.path().search("^/user") >= 0 ){
      $scope.topMenu = "users";
    }
    if($location.path().search("^/class_rooms") >= 0 ){
      $scope.topMenu = "class_rooms";
    }
    if($location.path().search("/user/sign_in") >= 0 ){
      $scope.topMenu = "home";
    }
    if($location.path().search("/accounts") >= 0 ){
      $scope.topMenu = "accounts";
    }
    if($location.path().search("^/sms") >= 0 || $location.path().search("^/meetings") >= 0){
      $scope.topMenu = "sms";
    }
    if($location.path() === "/"){
      $scope.topMenu = "home";
    }
  });

});
