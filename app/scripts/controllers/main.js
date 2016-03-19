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
    
    $scope.selectedChartType = 'day';
    $scope.off_class_labels = $scope.exam_labels = $scope.labels = [];
    $scope.off_class_series = $scope.exam_series = $scope.series = [];
    $scope.off_class_data = $scope.exam_data = $scope.data = [];
    $scope.off_class_sum_data = $scope.exam_sum_data = $scope.sum_data = [];
    
    var loadData = function(durationType){
      Restangular.all("organisations").customGET('absenty_graph_report', {duration_type: durationType}).then(function(data){
	if(data.success) {
	  $scope.labels = data.headers;
	  $scope.series = $scope.series = data.labels;
	  $scope.data = data.data;
	  $scope.sum_data = data.sum_data;
	}
      });  
      Restangular.all("organisations").customGET('exams_graph_report', {duration_type: durationType}).then(function(data){
	if(data.success) {
	  $scope.exam_labels = data.headers;
	  $scope.exam_series = $scope.series = data.labels;
	  $scope.exam_data = data.data;
	  $scope.exam_sum_data = data.sum_data;
	}
      });
      
      Restangular.all("organisations").customGET('off_class_graph_report', {duration_type: durationType}).then(function(data){
	if(data.success) {
	  $scope.off_class_labels = data.headers;
	  $scope.off_class_series = $scope.series = data.labels;
	  $scope.off_class_data = data.data;
	  $scope.off_class_sum_data = data.sum_data;
	}
      });
    };

    loadData('day');

    $scope.reloadReport = function(chartType) {
      loadData(chartType);
    };
    
    
    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };
    
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
