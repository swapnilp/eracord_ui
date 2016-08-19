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
      allocateStudent: '&',
      unallocatedStudents: '@',
      filterStudent: '=',
      deallocateStudentFromHostel: '&'
    },
    templateUrl: 'views/hostels/rooms.html',
    controller: ['$scope', 'Restangular', 'Flash', 'hostelStudentsFilter', '$confirm', function(scope, Restangular, Flash, hostelStudentsFilter, $confirm){
      scope.showRoom = true;
      scope.students = scope.room.students;
      scope.editHostelRoom = function(){
	scope.editRoom({roomId: scope.room.id});
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
