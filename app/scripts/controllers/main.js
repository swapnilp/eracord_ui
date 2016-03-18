'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('MainCtrl',['$rootScope', '$scope', 'Flash', '$location', 'Auth', 'Restangular',  '$cookieStore', function ($rootScope, $scope, Flash, $location, Auth, Restangular, $cookieStore) {


    if(!Auth.isAuthenticated()){
      $location.path('/user/sign_in').replace();
      return true;
    };
    
    if ($cookieStore.get('currentUser') === undefined) {
      $scope.eventSources = [];
      $location.path('/user/sign_in').replace();
      return true;
    }
    
    $scope.selectedChartType= 'daily';
    $scope.exam_labels = $scope.labels = [];
    $scope.exam_series = $scope.series = [];
    $scope.exam_data = $scope.data = [];
    $scope.exam_sum_data = $scope.sum_data = [];
    
    var loadData = function(){
      Restangular.all("organisations").customGET('absenty_graph_report').then(function(data){
	if(data.success) {
	  $scope.labels = data.headers;
	  $scope.series = $scope.series = data.labels;
	  $scope.data = data.data;
	  $scope.sum_data = data.sum_data;
	}
      });  
      Restangular.all("organisations").customGET('exams_graph_report').then(function(data){
	if(data.success) {
	  $scope.exam_labels = data.headers;
	  $scope.exam_series = $scope.series = data.labels;
	  $scope.exam_data = data.data;
	  $scope.exam_sum_data = data.sum_data;
	}
      });  
    };

    loadData();
    
    
    $scope.onClick = function (points, evt) {
      //console.log(points, evt);
    };
    
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
