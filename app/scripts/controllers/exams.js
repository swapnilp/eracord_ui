'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('ExamsCtrl',['$rootScope', '$scope', 'Flash', '$location', 'Auth', 'Restangular', '$routeParams', function ($rootScope, $scope, Flash, $location, Auth, Restangular, $routeParams) {

    var message = '<strong>Well done!</strong> You successfully read this important alert message.';

    if(!Auth.isAuthenticated()){
      $location.path('/user/sign_in');
      return true;
    };
    
    if($location.path() === '/exams') {
      var exams = Restangular.all("exams").getList();
      Flash.create('success', message, 'custom-class');
      
    };
    
    if($location.path() === "/classes/"+$routeParams.class_id+"/exams/new") {
      var jkci_classes = Restangular.all("jkci_classes");
      jkci_classes.customGET(""+$routeParams.class_id+"/get_exam_info").then(function(data){
	console.log(data.class_exam_data);
	$scope.class_name = data.class_exam_data.class_name;
	$scope.divisions = data.class_exam_data.sub_classes;
	$scope.subjects = data.class_exam_data.subjects;
	$scope.examTypes= [{name: "Subjectives", ticked: true}, {name: "Objectives"}];
	
      });
    };
    

  }]);

