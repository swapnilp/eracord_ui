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
      filterStudent: '='
    },
    templateUrl: 'views/hostels/rooms.html',
    controller: ['$scope', 'Restangular', 'Flash', 'hostelStudentsFilter', function(scope, Restangular, Flash, hostelStudentsFilter){
      scope.showRoom = true;
      scope.students = scope.room.students;
      scope.editHostelRoom = function(){
	scope.editRoom({roomId: scope.room.id});
      };

      scope.allocateRoomStudent = function() {
	scope.allocateStudent({roomId: scope.room.id, roomName: scope.room.name});
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
