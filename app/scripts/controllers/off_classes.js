'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */


angular.module('eracordUiApp.controller')
  .controller('OffClassesCtrl',['$rootScope', '$scope', 'Flash', '$location', 'Auth', 'Restangular', '$routeParams', 'Upload', '$window', '$cookieStore', '$uibModal', function ($rootScope, $scope, Flash, $location, Auth, Restangular, $routeParams, Upload, $window, $cookieStore, $uibModal) {

    if(!Auth.isAuthenticated()){
      $location.path('/user/sign_in').replace();
      return true;
    };
    if ($cookieStore.get('currentUser') === undefined) {
      $scope.eventSources = [];
      $location.path('/user/sign_in').replace();
      return true;
    }

    $scope.token = $cookieStore.get('currentUser').token;
    
    if($location.path() === '/off_classes') {

      $scope.off_classes = [];
      var base_off_classes = Restangular.all("off_classes");
      
      var load_off_classes = function() {
	base_off_classes.customGET("").then(function(data) {
	  $scope.off_classes = data.off_classes;
	})
      };

      load_off_classes();
      
    }
    //end of off_classes index
  }]);
