'use strict';
var app;

app = angular.module('eracordUiApp.directives');


app.directive('hostelRooms', function(Restangular) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      hostelId: '@',
      roomId: '@',
      room: '=',
      editRoom: '&',
      deleteRoom: '&',
      allocateStudent: '&',
      unallocatedStudents: '@',
      filterStudent: '=',
      deallocateStudentFromHostel: '&',
      reloadRooms: '&'
    },
    templateUrl: 'views/hostels/rooms.html',
    controller: ['$scope', 'Restangular', 'Flash', 'hostelStudentsFilter', '$confirm', '$uibModal', function(scope, Restangular, Flash, hostelStudentsFilter, $confirm, $uibModal){
      scope.showRoom = true;
      scope.students = scope.room.students;
      scope.editHostelRoom = function(){
	scope.editRoom({roomId: scope.room.id});
      };

      scope.deleteHostelRoom = function(){
	scope.deleteRoom({roomId: scope.room.id});
      };

      scope.allocateRoomStudent = function() {
	scope.allocateStudent({roomId: scope.room.id, roomName: scope.room.name});
      };

      scope.removeStudentFromHostel = function(student_id) {
	$confirm({text: 'Are you sure you want to remove from hostel?'})
          .then(function() {
            scope.deallocateStudentFromHostel({student_id: student_id});
          });
      };

      scope.changeStudentRoom = function(student_id, room_id) {
	var modalInstance = $uibModal.open({
	  animation: true,
	  templateUrl: 'views/hostels/change_room.html',
	  controller: 'ChangeHostelRoomCtrl',
	  size: 'lg',
	  resolve: {
	    student_id: function(){
	      return student_id;
	    },
	    room_id: function(){
	      return room_id;
	    },
	    hostel_id: function(){
	      return scope.hostelId;
	    }
	  }
	});

	modalInstance.result.then(null, function () {
	  scope.reloadRooms();
	});
      };

      scope.swapRoomStudents = function(student_id, room_id) {
	var modalInstance = $uibModal.open({
	  animation: true,
	  templateUrl: 'views/hostels/swap_room_student.html',
	  controller: 'SwapHostelRoomCtrl',
	  size: 'lg',
	  resolve: {
	    student_id: function(){
	      return student_id;
	    },
	    room_id: function(){
	      return room_id;
	    },
	    hostel_id: function(){
	      return scope.hostelId;
	    }
	  }
	});

	modalInstance.result.then(null, function () {
	  scope.reloadRooms();
	});
      }

      scope.showStudentsInfo = function(student_id) {
	var modalInstance = $uibModal.open({
	  animation: true,
	  templateUrl: 'views/students/student_info.html',
	  controller: 'StudentInfoCtrl',
	  size: 'lg',
	  resolve: {
	    student_id: function(){
	      return student_id;
	    }
	  }
	});
      }

      scope.$watch('filterStudent', function() {
	if(scope.filterStudent !== '' && scope.students.length === 0 ) {
	} else {
	  scope.students = hostelStudentsFilter(scope.students, scope.filterStudent)
	}
      });
    }]
  }
});
// end of class Catlog presenty
