'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp')
  .controller('MainCtrl',['$scope', 'Flash', function ($scope, Flash) {
    var message = '<strong>Well done!</strong> You successfully read this important alert message.';
    Flash.create('success', message, 'custom-class');
    
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
