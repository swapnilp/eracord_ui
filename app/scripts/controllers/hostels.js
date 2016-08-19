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
	if ($scope.hostels.length === 1) {
	  $location.path("/hostels/"+$scope.hostels[0].id).search('add_hostel', true).replace();
	}
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
    
    if($location.path().search("^/hostels/"+$routeParams.id) >= 0 ) {
      var hostels = Restangular.all("hostels");
      $scope.hostel = {};
      $scope.hostelRooms = [];
      $scope.filterStudent = "";
      $scope.newHostelShow= $routeParams.add_hostel;
      console.log($routeParams.add_hostel);
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

      var getHostelRooms = function(){
	hostels.one($routeParams.id).customGET("hostel_rooms").then(function(data) {
	  if(data.success) {
	    //$scope.hostel = data.hostel;
	    $scope.hostelRooms = data.rooms;
	    $scope.unallocatedStudents = data.unallocated_students;
	  }else {
	    $location.path("/hostels").replace();
	  }
	});
      };

      $scope.newRoom = function(size) {
	var modalInstance = $uibModal.open({
	  animation: true,
	  templateUrl: 'views/hostels/new_room.html',
	  controller: 'NewHostelRoomCtrl',
	  size: size,
	  resolve: {
	    hostel_id: function(){
	      return $routeParams.id;
	    }
	  }
	});

	modalInstance.result.then(null, function () {
	  getHostelRooms();
	});
      };

      $scope.editRoom = function(room_id) {
	var modalInstance = $uibModal.open({
	  animation: true,
	  templateUrl: 'views/hostels/new_room.html',
	  controller: 'EditHostelRoomCtrl',
	  size: 'lg',
	  resolve: {
	    hostel_id: function(){
	      return $routeParams.id;
	    },
	    room_id: function(){
	      return room_id;
	    }
	  }
	});

	modalInstance.result.then(null, function () {
	  getHostelRooms();
	});
      };

      $scope.allocateStudent = function(room_id, room_name) {
	var modalInstance = $uibModal.open({
	  animation: true,
	  templateUrl: 'views/hostels/allocate_room.html',
	  controller: 'AllocateHostelRoomCtrl',
	  size: 'lg',
	  resolve: {
	    hostel_id: function(){
	      return $routeParams.id;
	    },
	    room_id: function(){
	      return room_id;
	    },
	    room_name: function(){
	      return room_name;
	    }
	  }
	});

	modalInstance.result.then(null, function () {
	  getHostelRooms();
	});
      };
      
      getHostel();
      getHostelRooms();
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
  }])


  .controller('NewHostelRoomCtrl',['$scope', '$uibModalInstance', 'Restangular', 'hostel_id',
    function ($scope, $uibModalInstance, Restangular, hostel_id) {
      var hostels = Restangular.all("hostels");
      $scope.vm = {};
      $scope.vm.hostel_room = {};
      $scope.cancel = function () {
	$uibModalInstance.dismiss('cancel');
      };

      $scope.registerHostelRoom = function() {
	hostels.one(hostel_id).customPOST({hostel_room: $scope.vm.hostel_room}, "hostel_rooms").then(function(data){
	  if(data.success) {
	    $scope.cancel();
	  }
	});
      };
      
    }])

  .controller('EditHostelRoomCtrl',['$scope', '$uibModalInstance', 'Restangular', 'hostel_id', 'room_id',
    function ($scope, $uibModalInstance, Restangular, hostel_id, room_id) {
      var hostels = Restangular.all("hostels");
      $scope.vm = {};
      $scope.vm.hostel_room = {};
      $scope.requestLoading = true;
      $scope.cancel = function () {
	$uibModalInstance.dismiss('cancel');
      };
      
      var getRoom = function(){
	hostels.one(hostel_id).customGET("hostel_rooms/"+room_id+"/edit").then(function(data) {
	  if(data.success) {
	    $scope.vm.hostel_room = data.room;
	  }
	  $scope.requestLoading = false;
	});
      };
      
      $scope.registerHostelRoom = function() {
	hostels.one(hostel_id).customPUT({hostel_room: $scope.vm.hostel_room}, "hostel_rooms/"+room_id).then(function(data){
	  if(data.success) {
	    $scope.cancel();
	  }
	});
      };
      getRoom();
    }])

  .controller('AllocateHostelRoomCtrl',['$scope', '$uibModalInstance', 'Restangular', 'hostel_id', 'room_id', 'room_name',
    function ($scope, $uibModalInstance, Restangular, hostel_id, room_id, room_name) {
      var hostel = Restangular.one("hostels", hostel_id);
      //$scope.requestLoading = true;
      $scope.students = [];
      $scope.studentsList = [];
      $scope.roomName = room_name;
      
      $scope.cancel = function () {
	$uibModalInstance.dismiss('cancel');
      };

      var getStudents = function() {
	hostel.customGET("get_unallocated_students").then(function(data) {
	  if(data.success) {
	    $scope.students = data.students;
	  } else {
	    $scope.cancel();
	  }
	});
      };

      $scope.allocateStudentRoom = function() {
	console.log($scope.studentsList);
	hostel.one("hostel_rooms", room_id).customGET("allocate_students", {student_ids: $scope.studentsList.toString()}).then(function(data) {
	  if(data.success) {
	    $scope.cancel();
	  } else {
	  }
	});
      };

      getStudents();
    }]);



