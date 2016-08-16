'use strict';

/**
 * @ngdoc function
 * @name eracordUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eracordUiApp
 */
angular.module('eracordUiApp.controller')
  .controller('HostelsCtrl',['$rootScope', '$scope', 'Flash', 'lazyFlash', '$location', 'Auth', 'Restangular', '$routeParams', '$uibModal', function ($rootScope, $scope, Flash, lazyFlash, $location, Auth, Restangular, $routeParams, $uibModal) {
    
    
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

    if($location.path() === "/hostels/new") {
      var hostels = Restangular.all("hostels");
      $scope.requestLoading = false;
      $scope.isNew = true;
      
      $scope.registerHostel = function(){
	hostels.customPOST({hostel: $scope.vm.hostel}).then(function(data) {
	  if(data.success) {
	    $location.path("/hostels/"+data.id).replace();
	  }else {
	    
	  }
	});
      };
    }
    
    if($location.path() === "/hostels/" + $routeParams.id) {
      var hostels = Restangular.all("hostels");
      $scope.hostel = {};
      var getHostel = function(){
	hostels.customGET($routeParams.id).then(function(data) {
	  if(data.success) {
	    $scope.hostel = data.hostel;
	  }else {
	    lazyFlash.warning(data.message);
	    $location.path("/hostels").replace();
	  }
	});
      };
      getHostel();
    }

    if($location.path() === "/hostels/" + $routeParams.id + "/edit") {
      var hostels = Restangular.all("hostels");
      $scope.vm = {};
      $scope.vm.hostel = {};
      $scope.requestLoading = true;
      $scope.isNew = false;
      
      var getHostel = function(){
	hostels.customGET($routeParams.id).then(function(data) {
	  if(data.success) {
	    $scope.vm.hostel = data.hostel;
	  }else {
	    lazyFlash.warning(data.message);
	    $location.path("/hostels").replace();
	  }
	  $scope.requestLoading = false;
	});
      };

      $scope.registerHostel = function(){
	hostels.customPUT({hostel: $scope.vm.hostel}, $routeParams.id).then(function(data) {
	  if(data.success) {
	    $location.path("/hostels/"+data.id).replace();
	  }else {
	    lazyFlash.warning(data.message);
	    $location.path("/hostels").replace();
	  }
	});
      };
      
      getHostel();
    }
    
    
  }]);

