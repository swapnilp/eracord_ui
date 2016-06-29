'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('TeacherSubjectsCtrl',['$scope', '$uibModalInstance', 'Restangular', 'teacher_id',
    function ($scope, $uibModalInstance, Restangular, teacher_id) {
      $scope.teacher_id = teacher_id;
      
    }])
