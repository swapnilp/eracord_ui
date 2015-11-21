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

    var message = '<strong>Well done!</strong> You successfully read this important alert message.';
    Flash.create('success', message, 'custom-class');
    if(!Auth.isAuthenticated()){
      $location.path('/user/sign_in');
    }
    
    
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
