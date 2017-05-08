angular.module('eracordUiApp.controller')
  .controller('ExamsLogsCtrl',['$scope', '$uibModalInstance', 'Restangular', 'class_id', 'exam_id',
    function ($scope, $uibModalInstance, Restangular, class_id, exam_id)  {
      $scope.requestLoading = true;

      $scope.examId = exam_id;
      $scope.class_id = class_id;      
      var jkci_classes = Restangular.one("jkci_classes", class_id);

      
      jkci_classes.one("exams", $scope.examId).customGET("get_activities").then(function(data){
	if(data.success) {
	  $scope.activities = data.activities;
	  //	  $scope.count = data.count;
	} else {
	  $uibModalInstance.dismiss('cancel');
      	}
      	$scope.requestLoading = false;
      });
      
      
      $scope.cancel = function () {
	$uibModalInstance.dismiss('cancel');
      };
    }])
