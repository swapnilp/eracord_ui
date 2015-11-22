'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('ExamsCtrl',['$rootScope', '$scope', 'Flash', '$location', 'Auth', 'Restangular', function ($rootScope, $scope, Flash, $location, Auth, Restangular) {

    var message = '<strong>Well done!</strong> You successfully read this important alert message.';

    if(!Auth.isAuthenticated()){
      $location.path('/user/sign_in');
      return true;
    }
    var exams = Restangular.all("exams").getList();
    Flash.create('success', message, 'custom-class');
    

  }]);

