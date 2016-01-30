'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('MainCtrl',['$rootScope', '$scope', 'Flash', '$location', 'Auth', function ($rootScope, $scope, Flash, $location, Auth) {


    if(!Auth.isAuthenticated()){
      $location.path('/user/sign_in').replace();
      return true;
    }
    
    //Flash.create('success', message, 'custom-class');
    
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
