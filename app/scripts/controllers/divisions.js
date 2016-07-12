'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('DivisionsCtrl',['$rootScope', '$scope', 'Flash', '$location', 'Auth', 'Restangular', '$routeParams', '$window', '$uibModal', function ($rootScope, $scope, Flash, $location, Auth, Restangular, $routeParams, $window, $uibModal) {
    
    var jkci_classes;
    
    if(!Auth.isAuthenticated()){
      $location.path('/user/sign_in');
      return true;
    }

    if($location.path() === "/classes/"+$routeParams.class_id+"/divisions/new") {
      jkci_classes = Restangular.one("jkci_classes", $routeParams.class_id);
      $scope.classId = $routeParams.class_id;
      jkci_classes.get().then(function(data){
	$scope.classes = data.jkci_class;
      });

      $scope.registerDivision = function(){
	jkci_classes.customPOST({sub_class: $scope.vm.sub_class}, "sub_classes").then(function(data) {
	  if(data.success) {
	    $location.path("/classes/"+$scope.classId+"/divisions/"+ data.id).replace();
	  }else {
	    
	  }
	});
      };
    }

    if($location.path() === "/classes/"+$routeParams.class_id+"/divisions/"+$routeParams.division_id) {
      $scope.classId = $routeParams.class_id;
      $scope.divisionId = $routeParams.division_id;
      $scope.reloadStudent = 1;
      jkci_classes = Restangular.one("jkci_classes", $routeParams.class_id);
      
      jkci_classes.one("sub_classes", $scope.divisionId).get().then(function(data) {
	if(data.success) {
	  $scope.division = data.sub_class;
	}else {
	}
      });

      $scope.openAssignStudentModel = function(size) {
	var modalInstance = $uibModal.open({
	  animation: true,
	  templateUrl: 'views/classes/assign_students.html',
	  controller: 'DivisionAssignStudentCtrl',
	  size: size,
	  resolve: {
	    class_id: function(){
	      return $scope.classId;
	    },
	    division_id: function(){
	      return $scope.divisionId;
	    }
	  }
	});
	
	modalInstance.result.then(null, function () {
	  $scope.reloadStudent = $scope.reloadStudent + 1;
	});

      }

      $scope.deleteDivision = function() {
	if($window.confirm('Are you sure?')){
	  jkci_classes.one("sub_classes", $scope.divisionId).remove().then(function(data) {
	    if(data.success) {
	      $location.path("/classes/"+$routeParams.class_id+"/manage_class").replace();
	    }else {
	    } 
	  });
	}
      };
    }
  }])

  .controller('DivisionAssignStudentCtrl',['$scope', '$uibModalInstance', 'Restangular', 'class_id', 'division_id',
    function ($scope, $uibModalInstance, Restangular, class_id, division_id)  {
      $scope.requestLoading = true;
      $scope.dataLoading = false;
      $scope.divisionId = division_id;
      
      var jkci_classes = Restangular.one("jkci_classes", class_id);
      $scope.studentList = [];
      $scope.class_id = class_id;
      
      jkci_classes.one("sub_classes", $scope.divisionId).customGET("remaining_students").then(function(data){
	if(data.success) {
	  $scope.remainingStudents = data.students;
	  $scope.requestLoading = false;
	}else {
	  $uibModalInstance.dismiss('cancel');
	}
      });
      
      $scope.saveStudentList = function(){
	jkci_classes.one("sub_classes", $scope.divisionId).customPOST({students: $scope.studentList.join(',')}, "add_students").then(function(data){
	  if(data.success) {
	    $uibModalInstance.dismiss('cancel');
	  } else {
	    Flash.create('warning', "Please try again", 'alert-danger');
	  }
	});
      };
      
      $scope.cancel = function () {
	$uibModalInstance.dismiss('cancel');
      };
    }]);
