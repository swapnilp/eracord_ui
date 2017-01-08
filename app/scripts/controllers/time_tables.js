'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('DivisionTimeTableCtrl',['$scope', '$uibModalInstance', 'Restangular', 'class_id', 'division_id',
    function ($scope, $uibModalInstance, Restangular, class_id, division_id)  {
      $scope.requestLoading = true;

      $scope.divisionId = division_id;
      $scope.class_id = class_id;      
      var jkci_classes = Restangular.one("jkci_classes", class_id);

      $scope.days = ["Monday", "Tuesday", "Wednesday", "Thusday", "Friday", "Saturday", "Sunday"]
      jkci_classes.one("sub_classes", $scope.divisionId).customGET("get_time_table").then(function(data){
	if(data.success) {
	  $scope.timetable = data.timetable;
	  $scope.count = data.count;
	}else {
	  $uibModalInstance.dismiss('cancel');
	}
	$scope.requestLoading = false;
      });
      
      $scope.cancel = function () {
	$uibModalInstance.dismiss('cancel');
      };
    }])

  .controller('TeacherTimeTableCtrl',['$scope', '$uibModalInstance', 'Restangular', 'teacher_id',
    function ($scope, $uibModalInstance, Restangular, teacher_id)  {
      $scope.requestLoading = true;

      $scope.teacher_id = teacher_id;      
      
      var jkci_classes = Restangular.one("/organisations/teachers", teacher_id);

      $scope.days = ["Monday", "Tuesday", "Wednesday", "Thusday", "Friday", "Saturday", "Sunday"]
      
      jkci_classes.customGET("get_time_table").then(function(data){
	if(data.success) {
	  $scope.timetable = data.timetable;
	  $scope.count = data.count;
	}else {
	  $uibModalInstance.dismiss('cancel');
	}
	$scope.requestLoading = false;
      });
      
      $scope.cancel = function () {
	$uibModalInstance.dismiss('cancel');
      };
    }]);

