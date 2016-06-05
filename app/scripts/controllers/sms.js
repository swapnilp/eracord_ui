'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('SmsCtrl',['$rootScope', '$scope', 'Flash', '$location', 'Auth', 'Restangular', '$routeParams', 'Upload', '$window', '$cookieStore', function ($rootScope, $scope, Flash, $location, Auth, Restangular, $routeParams, Upload, $window, $cookieStore) {

    if(!Auth.isAuthenticated()){
      $location.path('/user/sign_in').replace();
      return true;
    };
    
    if ($cookieStore.get('currentUser') === undefined) {
      $scope.eventSources = [];
      $location.path('/user/sign_in').replace();
      return true;
    }
    var sms_sent = Restangular.all("sms_sent");
    if($location.path() === '/sms') {
      $scope.requestLoading = true;
      $scope.pagination = {
        current: 1
      };
      $scope.filterStudent = "";
      
      var getResultsPage = function(pageNumber){
	sms_sent.customGET("", {page: pageNumber, filter: $scope.filterStudent}).then(function(data){
	  $scope.sms_sents = data.sms_sents;
	  $scope.totalCount = data.count;
	  $scope.requestLoading = false;
	});
      }

      $scope.pageChanged = function(newPage) {
        getResultsPage(newPage);
      };

      getResultsPage(1);

      $scope.pageChanged = function(newPage) {
        getResultsPage(newPage);
      };
    }
    //end of sms index method
  }
]);
