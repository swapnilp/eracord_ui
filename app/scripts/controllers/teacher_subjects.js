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
      var base_organisation = Restangular.all("organisations");
      $scope.requestLoading = false;
      $scope.saveRequestLoading = false;
      $scope.subjectsList = [];
      $scope.cancel = function () {
	$uibModalInstance.dismiss('cancel');
      };

      $scope.addSubjects = function() {
	$scope.saveRequestLoading = true;
	base_organisation.customGET('teachers/'+teacher_id+'/save_subjects', {subjects: $scope.subjectsList.toString()}).then(function(data){
	  if(data.success) {
	    $scope.saveRequestLoading = false;
	    $uibModalInstance.dismiss('cancel');
	  }
	});
      }

      var getTeacherSubjects = function(){
	$scope.requestLoading = true;
	base_organisation.customGET('teachers/'+teacher_id+'/get_remaining_subjects').then(function(data){
	  $scope.subjects = data.subjects;
	  $scope.requestLoading = false;
	})
      };
      getTeacherSubjects();
      
    }])
