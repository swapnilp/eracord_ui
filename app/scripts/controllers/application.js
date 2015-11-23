'use strict';
var app;

app = angular.module('eracordUiApp.controller');

app.controller('ApplicationCtrl', function($rootScope, $scope, $location, $window, Auth, Flash, Restangular, $cookieStore) {
  var clearUserInformation, directAccessRoutes, i, len, path;
  $scope.userAlertCount = 0;
  $scope.alertsVisible = false;


  if ($scope.currentUser === null) {
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
  if ($cookieStore.get('currentUser') === null) {
    $location.path('/user/sign_in');
  }

  if ($location.path() !== '/user/sign_in') {
    Auth._currentUser = $cookieStore.get('currentUser');
    Auth.currentUser().then(function(user) {
      $scope.currentUser = user;
    });
  }


  clearUserInformation = function() {
    $cookieStore.remove('currentUser');
    return $scope.currentUser = {};
  };
  $scope.doLogout = function(flash) {
    if (flash === null) {
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


  return $rootScope.$on('devise:unauthorized', function(loopPrevention) {

    if (loopPrevention === null) {
      loopPrevention = false;
    }
    console.log('asdasdads');
    $scope.doLogout(false);
    if (loopPrevention) {
      if ($cookieStore.get('currentUser') === null) {
        return;
      }
      clearUserInformation();
      //Flash.clear();
      //return Flash.alert('Session error. Please log in again.').andRedirectTo('/user/sign_in');
    }
  });
});

