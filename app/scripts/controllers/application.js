'use strict';
var app;

app = angular.module('eracordUiApp.controller');

app.controller('ApplicationCtrl', function($rootScope, $scope, $location, $window, Auth, Flash, Restangular) {
  var clearUserInformation, directAccessRoutes, i, len, path;
  $scope.userAlertCount = 0;
  $scope.alertsVisible = false;


  if ($scope.currentUser == null) {
    $scope.currentUser = {};
  }
  $scope.goBack = function() {
    return window.history.back();
  };
  directAccessRoutes = ['/forgot-password/?', '/unlock-account/?', '/users/invitation/accept/?', '/users/password/edit/?', '/users/unlock/?'];
  for (i = 0, len = directAccessRoutes.length; i < len; i++) {
    path = directAccessRoutes[i];
    if ($location.path().search(path) !== -1) {
      return;
    }
  }
  if ($window.localStorage.currentUser == null) {
    $location.path('/user/sign_in');
  }

  if ($location.path() !== '/user/sign_in') {
    Auth.currentUser().then(function(user) {
      return $scope.currentUser = user;
    });
  }


  clearUserInformation = function() {
    $window.localStorage.clear();
    return $scope.currentUser = {};
  };
  $scope.doLogout = function(flash) {
    if (flash == null) {
      flash = true;
    }
    return Auth.logout().then(function() {
      clearUserInformation();
      //if (flash) {
      //  Flash.setMsg('notice', 'You have been logged out.');
      //}
      return $location.path('/user/sign_in');
    });
  };


  return $rootScope.$on('auth:unauthorized', function(loopPrevention) {
    if (loopPrevention == null) {
      loopPrevention = false;
    }
    console.log('asdasdads');
    $scope.doLogout(false);
    if (loopPrevention) {
      if ($window.localStorage.currentUser == null) {
        return;
      }
      clearUserInformation();
      //Flash.clear();
      //return Flash.alert('Session error. Please log in again.').andRedirectTo('/user/sign_in');
    }
  });
});

