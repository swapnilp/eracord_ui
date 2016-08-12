'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('HostelsCtrl',['$rootScope', '$scope', 'Flash', '$location', 'Auth', 'Restangular', '$routeParams', '$uibModal', function ($rootScope, $scope, Flash, $location, Auth, Restangular, $routeParams, $uibModal) {
    
    
    if(!Auth.isAuthenticated()){
      $location.path('/user/sign_in');
      return true;
    }

    if($location.path() === "/hostels") {
      var hostels = Restangular.all("hostels");
      
      hostels.customGET("").then(function(data){
	$scope.hostels = data.hostels;
      });
    }
    
    
  }]);

