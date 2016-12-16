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
      $scope.requestLoading = true;
      
      hostels.customGET("").then(function(data){
	if(data.success){
	  $scope.hostels = data.hostels;
	  if ($scope.hostels.length === 1) {
	    $location.path("/hostels/"+$scope.hostels[0].id).search('add_hostel', true).replace();
	  }
	}else {
	  lazyFlash.warning(data.message);
	  $location.path("/admin_desk").replace();
	}
	$scope.requestLoading = false;
      });
    }

    if($location.path() === "/hostels/new") {
      var hostels = Restangular.all("hostels");
      $scope.requestLoading = false;
      $scope.isNew = true;
      $scope.vm = {hostel: {}};
      $scope.months = [{id: 1, name: "Januery"}, {id: 2, name: "February"}, {id: 3, name: "March"},
        {id: 4, name: "April"}, {id: 5, name: "May"}, {id: 6, name: "June"},
        {id: 7, name: "July"}, {id: 7, name: "Auguest"}, {id: 9, name: "September"},
        {id: 10, name: "October"}, {id: 11, name: "November"}, {id:12, name: "December"}]
      $scope.vm.hostel.start_month = 6;
      $scope.registerHostel = function(){
	hostels.customPOST({hostel: $scope.vm.hostel}).then(function(data) {
	  if(data.success) {
	    $location.path("/hostels/"+data.id).replace();
	  }else {
	    
	  }
	});
      };
    }
    if($location.path() === "/hostels/" + $routeParams.id + "/edit") {
      var hostels = Restangular.all("hostels");
      $scope.vm = {};
      $scope.vm.hostel = {};
      $scope.months = [{id: 1, name: "Januery"}, {id: 2, name: "February"}, {id: 3, name: "March"},
        {id: 4, name: "April"}, {id: 5, name: "May"}, {id: 6, name: "June"},
        {id: 7, name: "July"}, {id: 7, name: "Auguest"}, {id: 9, name: "September"},
        {id: 10, name: "October"}, {id: 11, name: "November"}, {id:12, name: "December"}]
      $scope.requestLoading = true;
      $scope.isNew = false;
      
      var getHostel = function(){
	hostels.customGET($routeParams.id+"/edit").then(function(data) {
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
      //end of edit hostel 
    }else if($location.path() === "/hostels/" + $routeParams.id + "/logs") {
      var hostels = Restangular.all("hostels");
      $scope.pagination = {current: 1};
      $scope.requestLoading = false;
      $scope.filter = {};
      $scope.filter.dateRange = {startDate: null, endDate: null};

      var getHostelLogs = function(pageNumber){
	hostels.customGET($routeParams.id+"/get_logs", {filter: $scope.filter, page: pageNumber}).then(function(data) {
	  if(data.success) {
	    $scope.logs = data.logs;
	    $scope.totalLogs = data.total_count;
	  }else {
	    lazyFlash.warning(data.message);
	    $location.path("/hostels").replace();
	  }
	  $scope.requestLoading = false;
	});
      };

      $scope.pageChanged = function(newPage, checkFilter) {
	getHostelLogs(newPage);
      };

      $scope.resetFilter = function() {
	$scope.filter = {};
	$scope.filter.dateRange = {startDate: null, endDate: null};
	getHostelLogs(1);
      };
      
      getHostelLogs();
      
      //end of  hostel logs
    }else if($location.path().search("^/hostels/"+$routeParams.id) >= 0 ) {
      var hostels = Restangular.all("hostels");
      $scope.hostel = {};
      $scope.hostelRooms = [];
      $scope.filterStudent = "";
      $scope.newHostelShow= $routeParams.add_hostel;
      $scope.requestLoading = true;
      
      var getHostel = function(){
	hostels.customGET($routeParams.id).then(function(data) {
	  if(data.success) {
	    $scope.hostel = data.hostel;
	  }else {
	    lazyFlash.warning(data.message);
	    $location.path("/hostels").replace();
	  }
	  $scope.requestLoading = false;
	});
      };

      $scope.getHostelRooms = function(){
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
	  $scope.getHostelRooms();
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
	  $scope.getHostelRooms();
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
	  $scope.getHostelRooms();
	});
      };

      $scope.deallocateStudentFromHostel = function(student_id) {
	var student = Restangular.one("students", student_id);
	student.customDELETE("deallocate_hostel").then(function(data) {
	  if(data.success) {
	    $scope.hostel.occupied_students = $scope.hostel.occupied_students - 1;
	    getHostelRooms();
	  }
	});
      };
      
      getHostel();
      $scope.getHostelRooms();
    }

    
  }])


  .controller('NewHostelRoomCtrl',['$scope', '$uibModalInstance', 'Restangular', 'hostel_id',
    function ($scope, $uibModalInstance, Restangular, hostel_id) {
      var hostels = Restangular.all("hostels");
      $scope.vm = {};
      $scope.vm.hostel_room = {extra_charges: 0, beds: 1};
      
      $scope.cancel = function () {
	$uibModalInstance.dismiss('cancel');
      };

      $scope.registerHostelRoom = function() {
	$scope.message = false;
	hostels.one(hostel_id).customPOST({hostel_room: $scope.vm.hostel_room}, "hostel_rooms").then(function(data){
	  if(data.success) {
	    $scope.cancel();
	  } else {
	    $scope.message = data.message;
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
      $scope.students_count = 0;
      $scope.bedsError = false;
      
      var getRoom = function(){
	hostels.one(hostel_id).customGET("hostel_rooms/"+room_id+"/edit").then(function(data) {
	  if(data.success) {
	    $scope.vm.hostel_room = data.room;
	    $scope.students_count = data.students_count;
	  }
	  $scope.requestLoading = false;
	});
      };

      $scope.onChangeBeds = function() {
	if($scope.vm.hostel_room.beds < $scope.students_count) {
	  $scope.vm.hostel_room.beds = $scope.students_count;
	  $scope.bedsError = true;
	}else{
	  $scope.bedsError = false;
	}
      }

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
      $scope.remainingCount = 0;
      
      $scope.cancel = function () {
	$uibModalInstance.dismiss('cancel');
      };

      var getStudents = function() {
	hostel.customGET("get_unallocated_students", {room_id: room_id}).then(function(data) {
	  if(data.success) {
	    $scope.students = data.students;
	    $scope.remainingCount = data.remaining_count;
	  } else {
	    $scope.cancel();
	  }
	});
      };

      $scope.selectHostelRoom = function(student) {
	student.selected = !student.selected;
      };
      
      $scope.allocateStudentRoom = function() {
	hostel.one("hostel_rooms", room_id).customGET("allocate_students", {student_ids: $scope.studentsList.toString()}).then(function(data) {
	  if(data.success) {
	    $scope.cancel();
	  } else {
	  }
	});
      };

      getStudents();
    }])

  .controller('ChangeHostelRoomCtrl',['$scope', '$uibModalInstance', 'Restangular', 'hostel_id', 'room_id', 'student_id',
    function ($scope, $uibModalInstance, Restangular, hostel_id, room_id, student_id) {
      var hostel = Restangular.one("hostels", hostel_id);
      $scope.requestLoading = true;
      $scope.formLoading = false;
      $scope.isRoom = false;
      $scope.vm = {};
      
      $scope.cancel = function () {
	$uibModalInstance.dismiss('cancel');
      };

      $scope.students = [];
      
      var loadRooms = function() {
	hostel.one("students", student_id).customGET("get_other_rooms").then(function(data) {
	  if(data.success) {
	    $scope.studentName = data.student;
	    $scope.rooms = data.rooms;
	  } else {
	    
	  }
	  $scope.requestLoading = false;
	});
      };

      $scope.selectRoom = function(room_id) {
	$scope.room = _.findWhere($scope.rooms, {id: room_id});
	$scope.students = $scope.room.students;
	if($scope.room && $scope.room.is_available) {
	  $scope.isRoom = true;
	} else {
	  $scope.isRoom = false;
	}
      };

      $scope.changeRoom = function (room_id) {
	$scope.formLoading = true;
	hostel.one("students", student_id).customPOST({student: $scope.vm}, "change_room", {}).then(function(data) {
	  if(data.success) {
	    $scope.cancel();
	  } else {
	    
	  }
	  $scope.formLoading = false;
	});
      };
      
      loadRooms();
    }])

  .controller('SwapHostelRoomCtrl',['$scope', '$uibModalInstance', 'Restangular', 'hostel_id', 'room_id', 'student_id',
    function ($scope, $uibModalInstance, Restangular, hostel_id, room_id, student_id) {
      var hostel = Restangular.one("hostels", hostel_id);
      $scope.requestLoading = true;
      $scope.formLoading = false;
      $scope.vm = {};
      $scope.isSelected = false;
      
      $scope.cancel = function () {
	$uibModalInstance.dismiss('cancel');
      };

      $scope.students = [];
      
      var loadStudents = function() {
	hostel.one("students", student_id).customGET("get_hostel_students", {room_id: room_id}).then(function(data) {
	  if(data.success) {
	    $scope.studentName = data.student;
	    $scope.students = data.students;
	  } else {
	    
	  }
	  $scope.requestLoading = false;
	});
      };

      $scope.selectStudent = function(student_id){
	$scope.isSelected = true;
	$scope.selectedStudent = student_id;
      }

      $scope.swapRoom = function (room_id) {
	console.log($scope.selectedStudent);
	$scope.formLoading = true;
	hostel.one("students", student_id).customPOST({student: {}}, "swap_room_student", {swap_student_id: $scope.selectedStudent}).then(function(data) {
	  if(data.success) {
	    $scope.cancel();
	  } else {
	    
	  }
	});
      };
      
      loadStudents();
      
    }]);





